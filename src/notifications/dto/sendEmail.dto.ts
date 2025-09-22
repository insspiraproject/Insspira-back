import { IsEmail, IsNotEmpty, MinLength, Matches, MaxLength } from 'class-validator';
import {ApiProperty} from '@nestjs/swagger'

export class SendEmailDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({example: 'usuario@example.com'})
  email: string;

  @IsNotEmpty()
  @ApiProperty({ description: 'Nombre completo del usuario' })
  name: string;
     
}
