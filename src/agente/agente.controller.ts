import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AgenteService } from './agente.service';
import { CreateAgenteDto } from './dto/create-agente.dto';
import { UpdateAgenteDto } from './dto/update-agente.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Agente } from './agente.entity';

@Controller('agente')
export class AgenteController {
  constructor(private readonly agenteService: AgenteService) {}

 @Post()
  async create(@Body() createAgenteDto: CreateAgenteDto): Promise<Agente> {
    return this.agenteService.create(createAgenteDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.agenteService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.agenteService.findOneWithLaudos(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAgenteDto) {
    return this.agenteService.update(+id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.agenteService.remove(+id);
  }
}
