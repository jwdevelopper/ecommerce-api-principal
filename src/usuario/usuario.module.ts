import { PassportModule } from '@nestjs/passport';
import { UsuarioService } from './usuario.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioRepository } from './usuario.repository';
import { UsuarioController } from './usuario.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([UsuarioRepository]),
        PassportModule.register({ defaultStrategy: 'jwt' })
    ],
    providers: [UsuarioService],
    controllers: [UsuarioController]
})
export class UsuarioModule {}
