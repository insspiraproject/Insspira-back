import { PartialType } from "@nestjs/mapped-types";
import { ArrayNotEmpty, IsArray, IsNumber, IsPositive, IsString, IsUrl, IsUUID, Length, Matches } from "class-validator"

export class planDto {
    
    @IsString()
    name: string
    
    @IsNumber({ maxDecimalPlaces: 2 })
    @IsPositive()
    price: number 
    
    @IsString()
    @Matches(/^[A-Z]{3}$/, {message: "Accepts only 3-letter uppercase codes."})
    currency: string   
    
    @IsString()
    features: string

}

export class partialDto extends  PartialType(planDto){}

