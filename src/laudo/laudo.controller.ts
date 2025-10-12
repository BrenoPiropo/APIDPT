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
} from '@nestjs/common';
import { Response } from 'express';
import * as puppeteer from 'puppeteer';
import * as fs from 'fs';
import { LaudoService } from './laudo.service';
import { CreateLaudoDto } from './dto/create-laudo.dto';
import { gerarHtmlLaudo } from './templates/laudo.template';

@Controller('laudo')
export class LaudoController {
  private readonly logger = new Logger(LaudoController.name);

  constructor(private readonly laudoService: LaudoService) {}

  @Get()
  findAll() {
    return this.laudoService.findAll();
  }
  @Get('processo/:id_processo')
  async findByProcesso(@Param('id_processo') id_processo: number) {
    const laudo = await this.laudoService.findByProcesso(id_processo);
    if (!laudo) {
      throw new NotFoundException('Nenhum laudo encontrado para este processo');
    }
    return laudo;
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.laudoService.findOne(id);
  }

  @Post()
  create(@Body() createLaudoDto: CreateLaudoDto) {
    return this.laudoService.create(createLaudoDto);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() data: CreateLaudoDto) {
    return this.laudoService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.laudoService.remove(id);
  }

  // ---------------------------
  // Rota para gerar PDF e salvar no disco
  // GET /laudo/:id/pdf
  // ---------------------------
  
  @Get(':id/pdf')
  async gerarPdf(@Param('id') id: number, @Res() res: Response) {
    const laudo = await this.laudoService.findOne(id);

    if (!laudo) {
      throw new NotFoundException('Laudo não encontrado');
    }
    console.log('Laudo recebido para PDF:', laudo);

    const html = gerarHtmlLaudo(laudo);

    let browser: puppeteer.Browser | null = null;
    try {
      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });

      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0' });

      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' },
      });

      // ---------------------------
      // Salva o PDF no disco
      // ---------------------------
      const filePath = `C:/Users/Breno Piropo/Desktop/laudo_${id}.pdf`;
      fs.writeFileSync(filePath, pdfBuffer);
      this.logger.log(`PDF do Laudo ${id} salvo em: ${filePath}`);

      // Envia o PDF para o navegador também
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename=laudo_${id}.pdf`);
      res.send(pdfBuffer);
    } catch (err) {
      this.logger.error('Erro ao gerar PDF', (err as Error).stack);
      res.status(500).send('Erro ao gerar PDF');
    } finally {
      if (browser) await browser.close();
    }
  }
}
