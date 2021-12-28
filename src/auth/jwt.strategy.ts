import { UsuarioRepository } from './../usuario/usuario.repository';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(UsuarioRepository)
        private usuarioRepository: UsuarioRepository,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'super-secret'
        });
    }

    async validate(payload: { id: number }) {
        const { id } = payload;
        const usuario = await this.usuarioRepository.findOne(id, {
            select: ['nome', 'email', 'status', 'role'],
        });
        if(!usuario) {
            throw new UnauthorizedException('Usuário não encontrado');
        }
        return usuario;
    }

    
}