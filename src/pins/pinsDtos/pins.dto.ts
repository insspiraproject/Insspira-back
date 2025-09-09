import { ArrayNotEmpty, IsArray, IsString, IsUrl, IsUUID, Length } from "class-validator"


export class pinsDto {

    @IsUrl({}, { message: "La imagen debe ser una URL válida" })
    image: string;

    @IsString({ message: "La descripción debe ser texto" })
    @Length(3, 200, { message: "La descripción debe tener entre 3 y 200 caracteres" })
    description: string;

}

