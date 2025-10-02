import { PartialType } from "@nestjs/mapped-types";
import { ArrayNotEmpty, IsArray, IsNumber, IsPositive, IsString, IsUrl, IsUUID, Length, Matches, Min } from "class-validator"
import { ApiProperty } from "@nestjs/swagger";

export class planDto {

    @ApiProperty({ example: 'Premium Annual' })
    @IsString()
    name: string;

    @ApiProperty({ example: 100, description: 'USD amount' })
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    price: number;

    @ApiProperty({ example: 'USD', description: '3-letter currency code' })
    @IsString()
    @Matches(/^[A-Z]{3}$/, { message: "Accepts only 3-letter uppercase codes." })
    currency: string;

    @ApiProperty({ example: '10 pins/month, Basic search' })
    @IsString()
    features: string;
    
  }

export class partialDto extends PartialType(planDto) {}

