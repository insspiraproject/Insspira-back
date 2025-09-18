import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CategoryDto {
  @IsString()
  @ApiProperty({example: 'Nombre completo de la categoria'})
  name: string;
}


