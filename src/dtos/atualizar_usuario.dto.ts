import { IsOptional, IsString } from "class-validator";
import { UsuarioRole } from "src/usuario/usuario.enum";

export class AtualizarUsuarioDto {
    @IsOptional()
    @IsString({message:'Informe um nome de usuário válido'})
    nome: string;

    @IsOptional()
    @IsString({message:'Informe um endereço de email válido'})
    email: string;

    @IsOptional()
    role:UsuarioRole;

    @IsOptional()
    status:boolean;
}