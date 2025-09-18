import { PartialType } from "@nestjs/mapped-types";
import { ArrayNotEmpty, IsArray, IsNumber, IsPositive, IsString, IsUrl, IsUUID, Length, Matches } from "class-validator"
import { ApiProperty } from "@nestjs/swagger";

export class planDto {
    
    @IsString()
    @ApiProperty({example: 'Nombre completo del usuario'})
    name: string
    
    @IsNumber({ maxDecimalPlaces: 2 })
    @IsPositive()
    @ApiProperty({example: '$200.00'})
    price: number 
    
    @IsString()
    @Matches(/^[A-Z]{3}$/, {message: "Accepts only 3-letter uppercase codes."})
    @ApiProperty({example: 'USD'})
    currency: string   
    
    @IsString()
    @ApiProperty({
        description: 'Características o atributos principales del producto',
        example: 'Pantalla táctil, 128GB, Color negro',
      })
    features: string

}

export class partialDto extends  PartialType(planDto){}

