// src/users/dto/create-user.dto.ts
import { IsEmail, IsString, IsBoolean, IsOptional, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'johndoe' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'john@insspira.com' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: '+573001112233' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ minLength: 8 })
  @IsString()
  @IsOptional()
  @MinLength(8)
  @MaxLength(100)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).+$/)
  password?: string;

  @ApiPropertyOptional({ minLength: 8 })
  @IsString()
  @IsOptional()
  @MinLength(8)
  @MaxLength(100)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).+$/)
  confirmPassword?: string;

  @ApiPropertyOptional({ example: 'https://res.cloudinary.com/.../avatar.jpg' })
  @IsString()
  @IsOptional()
  profilePicture?: string;

  @ApiPropertyOptional({ maxLength: 150 })
  @IsString()
  @IsOptional()
  @MaxLength(150)
  biography?: string;

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  isAdmin?: boolean;
}
