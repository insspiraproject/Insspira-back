import { PartialType } from "@nestjs/mapped-types";
import { ArrayNotEmpty, IsArray, IsString, IsUrl, IsUUID, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class pinsDto {

  @IsUrl({}, { message: "Image has to be a valid URL" })
  @ApiProperty({
    example: 'https://miapp.com/images/foto.png',
    description: 'URL de la imagen del pin (debe ser una URL válida)'
  })
  image: string;

  @IsString({ message: "Description must be a string" })
  @Length(3, 200, { message: "Description must be between 3 and 200 characters" })
  @ApiProperty({
    example: 'Hermosa puesta de sol en la playa',
    description: 'Descripción del pin, entre 3 y 200 caracteres'
  })
  description: string;

  @IsUUID("4", { message: "ID category must be a valid UUID" })
  @ApiProperty({
    example: 'a3e1f2d4-5b6c-7d8e-9f01-234567890abc',
    description: 'ID de la categoría a la que pertenece el pin (UUID válido)'
  })
  categoryId: string;
}

export class updateDto extends  PartialType(pinsDto){}