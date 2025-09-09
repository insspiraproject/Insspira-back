import { ArrayNotEmpty, IsArray, IsString, IsUrl, IsUUID, Length } from "class-validator"


export class pinsDto {

    @IsUrl({}, { message: "La imagen debe ser una URL válida" })
    image: string;

    @IsString({ message: "La descripción debe ser texto" })
    @Length(3, 200, { message: "La descripción debe tener entre 3 y 200 caracteres" })
    description: string;

    @IsArray({ message: "Debe ser un arreglo de hashtags" })
    @ArrayNotEmpty({ message: "Debe tener al menos un hashtag" })
    @IsString({ each: true, message: "Cada hashtag debe ser texto" })
    hashtags: string[];

    @IsUUID("4", { message: "La categoría debe ser un UUID válido" })
    categoryId: string;

    @IsUUID("4", { message: "La categoría debe ser un UUID válido" })
    userId: string;
}

