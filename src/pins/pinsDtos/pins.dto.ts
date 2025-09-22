// src/pins/pinsDtos/pins.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { ArrayNotEmpty, IsArray, IsString, IsUrl, IsUUID, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class pinsDto {
  @ApiProperty({ example: 'https://res.cloudinary.com/.../image.jpg' })
  @IsUrl({}, { message: 'Image has to be a valid URL' })
  image: string;

  @ApiProperty({ example: 'Amazing interior inspiration', minLength: 3, maxLength: 200 })
  @IsString({ message: 'Desciption must be a string' })
  @Length(3, 200, { message: 'Description must be between 3 and 200 characters' })
  description: string;

  @ApiProperty({ example: '5c20797c-5c07-42be-8cda-18cc063e8b3c', format: 'uuid' })
  @IsUUID('4', { message: 'ID category must be a valid UUID' })
  categoryId: string;
}
export class updateDto extends PartialType(pinsDto) {}
