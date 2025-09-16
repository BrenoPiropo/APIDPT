// src/auth/auth.controller.ts
import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public() // 👈 rota não precisa de token
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    console.log('Recebendo login em AuthController:', loginDto);

    const agenteValido = await this.authService.validateUser(
      loginDto.nome_agente,
      loginDto.senha,
    );

    if (!agenteValido) {
      console.log('Credenciais inválidas no AuthController');
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const { agente, token } = await this.authService.login(
      loginDto.nome_agente,
      loginDto.senha,
    );

    return {
      success: true,
      data: {
        id_agente: agente.id_agente,
        nome_agente: agente.nome_agente,
        access_token: token,
      },
    };
  }
}
