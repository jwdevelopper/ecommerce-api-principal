import { UsuarioService } from './usuario.service';
import { Body, Controller, Delete, ForbiddenException, Get, Param, Patch, Post, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { CriarUsuarioDto } from 'src/dtos/criar_usuario.dto';
import { RetornarUsuarioDto } from 'src/dtos/retorna_usuario.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/auth/role.decorator';
import { UsuarioRole } from './usuario.enum';
import { AtualizarUsuarioDto } from 'src/dtos/atualizar_usuario.dto';
import { GetUsuario } from 'src/auth/user.decorator';
import { Usuario } from './usuario.entity';
import { BuscarUsuariosQueryDto } from './dto/buscar_usuarios_query_dto';

@Controller('usuarios')
@UseGuards(AuthGuard(), RolesGuard)
export class UsuarioController {

    constructor(private usuarioService:UsuarioService){}

    @Post()
    @Role(UsuarioRole.ADMIN)
    async criarUsuarioAdmin(@Body(ValidationPipe) criarUsuarioDto: CriarUsuarioDto): Promise<RetornarUsuarioDto> {
        const usuario = await this.usuarioService.criarUsuarioAdmin(criarUsuarioDto);
        return {
            usuario,
            mensagem: 'Administrador cadastrado com sucesso'
        };
    }

    @Get(':id')
    @Role(UsuarioRole.ADMIN)
    async buscarUsuarioById(@Param('id') id): Promise<RetornarUsuarioDto> {
        const usuario = await this.usuarioService.buscarUsuarioPorId(id);
        return {
            usuario,
            mensagem: "Usuario encontrado"
        }
    }

    @Patch(':id')
    async atualizarUsuario(
        @Body(ValidationPipe) atualizarUsuarioDto: AtualizarUsuarioDto,
        @GetUsuario() usuario:Usuario,
        @Param('id') id:string
    ) {
        if(usuario.role != UsuarioRole.ADMIN && usuario.id.toString() != id){
            throw new ForbiddenException(
                'Você não tem permissão para acessar esse recurso'
            );
        } else {
            return this.usuarioService.atualizarUsuario(atualizarUsuarioDto, id);
        }
    }

    @Delete(':id')
    @Role(UsuarioRole.ADMIN)
    async deletarUsuario(@Param('id') id: string) {
        await this.usuarioService.deletarUsuario(id);
        return {
            mensagem:'Usuário removido com sucesso!'
        };
    }

    @Get()
    @Role(UsuarioRole.ADMIN)
    async buscarUsuarios(@Query() query:BuscarUsuariosQueryDto) {
        const found = await this.usuarioService.buscarUsuarios(query);
        return {
            found,
            mensagem: 'Usuarios encontrados!'
        }
    }
}
