import { AuthService } from './auth.service';
import { CriarUsuarioDto } from './../dtos/criar_usuario.dto';
import { Body, Controller, Get, Post, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { CredenciaisDto } from 'src/dtos/credenciais_dto';
import { AuthGuard } from '@nestjs/passport';
import { Usuario } from 'src/usuario/usuario.entity';
import { GetUsuario } from './user.decorator';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    @Post('/signup')
    async signUp(
        @Body(ValidationPipe) criarUsuarioDto: CriarUsuarioDto
    ): Promise<{ message:string }> {
        await this.authService.signUp(criarUsuarioDto);
        return {
            message : 'Cadastro realizado com sucesso'
        };
    }

    @Post('/signin')
    async signIn(@Body(ValidationPipe) credenciaisDto: CredenciaisDto): Promise<{ token: string }> {
        return await this.authService.signIn(credenciaisDto);
    }

    @Get('/me')
    @UseGuards(AuthGuard())
    getMe(@GetUsuario() usuario: Usuario): Usuario {
        return usuario;
    }

}
