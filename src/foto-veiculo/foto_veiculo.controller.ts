import { 
  Controller, 
  Post, 
  Body, 
  UploadedFiles, 
  UseInterceptors, 
  BadRequestException 
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import { FotoVeiculoService } from './foto_veiculo.service';

@Controller('foto-veiculo')
export class FotoVeiculoController {
  constructor(private readonly fotoService: FotoVeiculoService) {}

  @Post('upload-completo')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'foto_veiculo', maxCount: 10 },
        { name: 'foto_vidros', maxCount: 10 },
        { name: 'foto_placa', maxCount: 10 },
        { name: 'foto_chassi', maxCount: 10 },
        { name: 'foto_motor', maxCount: 10 },
      ],
      {
        storage: diskStorage({
          destination: (req, file, cb) => {
            const id_laudo = req.body.id_laudo;
            if (!id_laudo) {
              return cb(new BadRequestException('id_laudo é obrigatório'), '');
            }
            const folder = `./uploads/Fotos do laudo ${id_laudo}`;
            if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
            cb(null, folder);
          },
          filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = extname(file.originalname);
            cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
          },
        }),
      },
    ),
  )
  async uploadComplete(
    @UploadedFiles() files: { 
      foto_veiculo?: Express.Multer.File[]; 
      foto_vidros?: Express.Multer.File[]; 
      foto_placa?: Express.Multer.File[];
      foto_chassi?: Express.Multer.File[];
      foto_motor?: Express.Multer.File[];
    },
    @Body('veiculo_id') veiculo_id: number,
  ) {
    if (!veiculo_id) {
      throw new BadRequestException('veiculo_id é obrigatório para manter a FK');
    }

    if (!files || Object.keys(files).length === 0) {
      throw new BadRequestException('Nenhum arquivo enviado');
    }

    // Converte os arquivos para apenas os nomes das imagens
    const fotosData = {
      foto_veiculo: files.foto_veiculo?.map(f => f.filename) || [],
      foto_vidros: files.foto_vidros?.map(f => f.filename) || [],
      foto_placa: files.foto_placa?.map(f => f.filename) || [],
      foto_chassi: files.foto_chassi?.map(f => f.filename) || [],
      foto_motor: files.foto_motor?.map(f => f.filename) || [],
    };

    // Salva todas as fotos em um único registro
    const fotos = await this.fotoService.saveFotos(veiculo_id, fotosData);

    return {
      success: true,
      message: `Fotos do veículo ${veiculo_id} enviadas com sucesso!`,
      fotos,
    };
  }
}
