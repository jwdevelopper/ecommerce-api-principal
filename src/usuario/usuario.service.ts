import { Injectable, InternalServerErrorException, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AtualizarUsuarioDto } from 'src/dtos/atualizar_usuario.dto';
import { CriarUsuarioDto } from '../dtos/criar_usuario.dto';
import { BuscarUsuariosQueryDto } from './dto/buscar_usuarios_query_dto';
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

    async buscarUsuarioPorId(usuarioId:string): Promise<Usuario> {
        const usuario = await this.usuarioRepository.findOne(usuarioId, {
            select: ['email', 'nome', 'role', 'id'],
        });

        if(!usuario) throw new NotFoundException('Usuario não encontrado');

        return usuario;
    }

    async atualizarUsuario(atualizarUsuarioDto: AtualizarUsuarioDto, id: string): Promise<Usuario> {
        const usuario = await this.buscarUsuarioPorId(id);
        const {nome,email,role,status} = atualizarUsuarioDto;
        usuario.nome = nome ? nome : usuario.nome;
        usuario.email = email ? email : usuario.email;
        usuario.role = role ? role : usuario.role;
        usuario.status = status === undefined ? usuario.status : status;

        try {
            await usuario.save();
            return usuario;
        } catch (error) {
            throw new InternalServerErrorException('Erro ao salvar dados no banco de dados');
        }
    }

    async deletarUsuario(usuarioId: string) {
        const resultado = await this.usuarioRepository.delete({id:usuarioId});
        if(resultado.affected === 0){
            throw new NotFoundException('Não foi encontrado um usuário com o ID informado');
        }
    }

    async buscarUsuarios(queryDto:BuscarUsuariosQueryDto): Promise<{usuarios:Usuario[]; total:number }> {
        const usuarios = await this.usuarioRepository.buscarUsuarios(queryDto);
        return usuarios;
    }
}
