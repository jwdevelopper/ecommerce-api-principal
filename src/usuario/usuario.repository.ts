import { Usuario } from './usuario.entity';
import { EntityRepository, Repository } from "typeorm";
import { CriarUsuarioDto } from '../dtos/criar_usuario.dto';
import { UsuarioRole } from './usuario.enum';

import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import { CredenciaisDto } from 'src/dtos/credenciais_dto';
import { BuscarUsuariosQueryDto } from './dto/buscar_usuarios_query_dto';

@EntityRepository(Usuario)
export class UsuarioRepository extends Repository<Usuario> {
    

    async adicionarUsuario(
        criaUsuarioDto:CriarUsuarioDto,
        role: UsuarioRole,

    ): Promise<Usuario> {
        const { email, nome, senha } = criaUsuarioDto;

        const usuario = this.create();
        usuario.email = email;
        usuario.nome = nome;
        usuario.role = role;
        usuario.status = true;
        usuario.confirmacaoToken = crypto.randomBytes(32).toString('hex');
        usuario.salt = await bcrypt.genSalt();
        usuario.senha = await this.hashPassword(senha, usuario.salt);
        try {
            await usuario.save();
            delete usuario.senha;
            delete usuario.salt;
            return usuario;
        } catch (error) {
            if(error.code.toString() === '23505'){
                throw new ConflictException('Endereço de email ja cadastrado');
            } else {
                throw new InternalServerErrorException(
                    'Erro ao salvar o usuário no banco de dados',
                );
            }
        }
    }

    async checarCredenciais(credenciaisDto:CredenciaisDto){
        const { email,senha } = credenciaisDto;
        const usuario = await this.findOne({email, status:true});

        if(usuario && (await usuario.checarSenha(senha))){
            return usuario;
        } else {
            return null;
        }
    }

    private async hashPassword(senha: string, salt: string): Promise<string>{
        return bcrypt.hash(senha,salt);
    }

    async buscarUsuarios( queryDto: BuscarUsuariosQueryDto): Promise<{usuarios:Usuario[]; total:number}> {
        console.log('Dados vindo: ' + JSON.stringify(queryDto));
        queryDto.status = queryDto.status === undefined ? true : queryDto.status;
        //queryDto.page = queryDto.page < 1 ? 1 : queryDto.page;
        queryDto.page = 1;
        //queryDto.limit = queryDto.limit > 100 ? 100 : queryDto.limit;
        queryDto.limit = 100;

        const {email,nome,status,role} = queryDto;
        const query = this.createQueryBuilder('usuario');
        query.where('usuario.status = :status', {status});

        if(email){
            query.andWhere('usuario.email ILIKE :email', { email: `%${email}%`});
        }

        if(nome) {
            query.andWhere('usuario.nome ILIKE :nome', { nome: `%${nome}%`});
        }

        if(role) {
            query.andWhere('usuario.role = :role', { nome });
        }
        console.log('Pagina: ' + queryDto.page);
        console.log('Limite: ' + queryDto.limit);
        query.skip((queryDto.page - 1) * queryDto.limit);
        query.take(+queryDto.limit);
        query.orderBy(queryDto.sort ? JSON.parse(queryDto.sort) : undefined);
        query.select(['usuario.nome', 'usuario.email', 'usuario.role', 'usuario.status']);

        const [usuarios, total] = await query.getManyAndCount();

        return { usuarios, total };
    }

}