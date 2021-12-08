import { UsuarioService } from './usuario.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioRepository } from './usuario.repository';
import { UsuarioController } from './usuario.controller';

@Module({
    imports: [TypeOrmModule.forFeature([UsuarioRepository])],
    providers: [UsuarioService],
    controllers: [UsuarioController]
})
export class UsuarioModule {}
