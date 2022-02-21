import { BaseQueryParametersDto } from "src/shared/dto/base-query-parameters.dto";

export class BuscarUsuariosQueryDto extends BaseQueryParametersDto {
    nome: string;
    email: string;
    status: boolean;
    role: string;
}