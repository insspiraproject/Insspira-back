import { Type } from 'class-transformer';
import { IsEmail, IsString, IsDate, IsBoolean, IsOptional, MinLength, MaxLength, Matches } from 'class-validator';

export class CreateUserDto {
    @IsString()
    username: string;

    @IsEmail()
    email: string;

    @IsString()
    @IsOptional()
    phone?: string;

    
     @IsDate()
  @Type(() => Date)
    birthdate: Date;

    @IsString()
    @IsOptional() 
    @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
    @MaxLength(100, { message: 'La contraseña no puede exceder 100 caracteres' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).+$/, {
        message: 'La contraseña debe contener al menos una letra minúscula, una mayúscula, un número y un carácter especial (!@#$%^&*).',
    })
    password?: string;

    @IsBoolean()
    @IsOptional() 
    isAdmin?: boolean;
}