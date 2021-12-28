import { UsuarioService } from './usuario.service';
import { Body, Controller, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { CriarUsuarioDto } from 'src/dtos/criar_usuario.dto';
import { RetornarUsuarioDto } from 'src/dtos/retorna_usuario.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('usuarios')
export class UsuarioController {

    constructor(private usuarioService:UsuarioService){}

    @Post()
    @UseGuards(AuthGuard())
    async criarUsuarioAdmin(@Body(ValidationPipe) criarUsuarioDto: CriarUsuarioDto): Promise<RetornarUsuarioDto> {
        const usuario = await this.usuarioService.criarUsuarioAdmin(criarUsuarioDto);
        return {
            usuario,
            mensagem: 'Administrador cadastrado com sucesso'
        };
    }
}
