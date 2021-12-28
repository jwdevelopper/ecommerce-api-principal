import { CriarUsuarioDto } from './../dtos/criar_usuario.dto';
import { UsuarioRepository } from './../usuario/usuario.repository';
import { Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from 'src/usuario/usuario.entity';
import { UsuarioRole } from 'src/usuario/usuario.enum';
import { CredenciaisDto } from 'src/dtos/credenciais_dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UsuarioRepository)
        private usuarioRepository: UsuarioRepository,
        private jwtService: JwtService
    ){}

    async signUp(criarUsuarioDto:CriarUsuarioDto): Promise<Usuario> {
        if(criarUsuarioDto.senha != criarUsuarioDto.confirmacaoSenha) {
            throw new UnprocessableEntityException('As senhas são diferentes');
        } else {
            return await this.usuarioRepository.adicionarUsuario(criarUsuarioDto,UsuarioRole.USUARIO);
        }
    }

    async signIn(credenciaisDto: CredenciaisDto) {
        const usuario = await this.usuarioRepository.checarCredenciais(credenciaisDto);
        if(usuario === null){
            throw new UnauthorizedException('Credenciais inválidas');
        }
        const jwtPayload = { id: usuario.id };
        const token = await this.jwtService.sign(jwtPayload);

        return {token};
    }
}
