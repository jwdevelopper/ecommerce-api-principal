import { createParamDecorator } from "@nestjs/common";
import { Usuario } from "src/usuario/usuario.entity";

export const GetUsuario = createParamDecorator(
    (data,req): Usuario => {
        const usuario = req.args[0].user;
        return usuario;
    },
);