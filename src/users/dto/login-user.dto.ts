// src/users/dto/login-user.dto.ts
import { IsEmail, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({ example: 'john@insspira.com' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ minLength: 8 })
  @IsString()
  @IsOptional()
  @MinLength(8)
  @MaxLength(100)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).+$/)
  password?: string;
}
