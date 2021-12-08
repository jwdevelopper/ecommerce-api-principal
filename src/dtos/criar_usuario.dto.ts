import { IsEmail, IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class CriarUsuarioDto {
    @IsNotEmpty({message: 'Informe um endereço de email!'})
    @IsEmail({message: 'Informe um endereço de email valido'})
    @MaxLength(200,{message: 'O email não pode conter mais que 200 caracteres'})
    email: string;
    @IsNotEmpty({message:'Informe o nome do usuario'})
    @MaxLength(250, {message: 'O nome deve conter menos que 250 caracteres'})
    nome: string;
    @IsNotEmpty({message: 'Infome uma senha'})
    @MinLength(6,{message: 'A senha deve conter mais de 6 caracteres'})
    senha: string;
    @IsNotEmpty({message:'Informe a confirmação de senha'})
    @MinLength(6,{message:'A confirmação de senha deve conter mais de 6 caracteres'})
    confirmacaoSenha: string;
}