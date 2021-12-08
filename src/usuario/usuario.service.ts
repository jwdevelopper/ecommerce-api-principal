import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CriarUsuarioDto } from '../dtos/criar_usuario.dto';
import { Usuario } from './usuario.entity';
import { UsuarioRole } from './usuario.enum';
import { UsuarioRepository } from './usuario.repository';

@Injectable()
export class UsuarioService {
    constructor(
        @InjectRepository(UsuarioRepository)
        private usuarioRepository: UsuarioRepository
    ){}

    async criarUsuarioAdmin(criarUsuarioDto: CriarUsuarioDto): Promise<Usuario> {
        if(criarUsuarioDto.senha != criarUsuarioDto.confirmacaoSenha){
            throw new UnprocessableEntityException('As senhas não são iguais');
        } else {
            return this.usuarioRepository.adicionarUsuario(criarUsuarioDto, UsuarioRole.ADMIN);
        }
    }
}
