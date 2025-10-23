import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Res,
  NotFoundException,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { Response } from 'express';
import * as puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';
import { LaudoService } from './laudo.service';
import { CreateLaudoDto } from './dto/create-laudo.dto';
import { gerarHtmlLaudo } from './templates/laudo.template';

@Controller('laudo')
export class LaudoController {
  private readonly logger = new Logger(LaudoController.name);

  constructor(private readonly laudoService: LaudoService) {}

  // 🔹 Retorna todos os laudos
  @Get()
  async findAll() {
    return this.laudoService.findAll();
  }

  // 🔹 Retorna um laudo específico
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const laudo = await this.laudoService.findOne(id);
    if (!laudo) throw new NotFoundException(`Laudo com ID ${id} não encontrado`);
    return laudo;
  }

  // 🔹 Cria um novo laudo
  @Post()
  async create(@Body() createLaudoDto: CreateLaudoDto) {
    return this.laudoService.create(createLaudoDto);
  }

  // 🔹 Atualiza um laudo
  @Put(':id')
  async update(@Param('id') id: number, @Body() updateLaudoDto: any) {
    const laudo = await this.laudoService.update(id, updateLaudoDto);
    if (!laudo) throw new NotFoundException(`Laudo com ID ${id} não encontrado`);
    return laudo;
  }

  // 🔹 Remove um laudo
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.laudoService.remove(id);
  }

  // 🔹 Gera o PDF do laudo e salva localmente
  @Get('pdf/:id')
  async gerarPdf(@Param('id') id: number, @Res() res: Response) {
    this.logger.log(`Gerando PDF do laudo ${id}...`);

    try {
      const laudo = await this.laudoService.findOne(id);
      if (!laudo) throw new NotFoundException(`Laudo ${id} não encontrado`);

      // 🟢 Caminho relativo da pasta uploads
      const uploadsDir = path.resolve('./uploads');
      const laudoDir = path.join(uploadsDir, `laudo_${id}`);

      // Cria diretórios se não existirem
      if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
      if (!fs.existsSync(laudoDir)) fs.mkdirSync(laudoDir, { recursive: true });

      // 🧩 Gera o HTML do laudo
      const htmlContent = gerarHtmlLaudo(laudo);

      // Caminho completo do PDF
      const pdfPath = path.join(laudoDir, `laudo_${id}.pdf`);

      // 🦊 Inicializa o Puppeteer
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });

      const page = await browser.newPage();
      await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

      await page.pdf({
        path: pdfPath,
        format: 'A4',
        printBackground: true,
        margin: { top: '15mm', bottom: '15mm', left: '15mm', right: '15mm' },
      });

      await browser.close();

      this.logger.log(`PDF do Laudo ${id} salvo em: ${pdfPath}`);

      // 📤 Envia o arquivo PDF como resposta
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename=laudo_${id}.pdf`,
      });

      const fileStream = fs.createReadStream(pdfPath);
      fileStream.pipe(res);
    } catch (error) {
      this.logger.error('Erro ao gerar PDF do laudo:', error);
      throw new InternalServerErrorException('Erro ao gerar PDF');
    }
  }
}
