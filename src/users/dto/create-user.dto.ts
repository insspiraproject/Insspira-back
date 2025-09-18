import { Type } from 'class-transformer';
import { IsEmail, IsString, IsBoolean, IsOptional, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {

  @IsString()
  @ApiProperty({ example: 'John Doe', description: 'Nombre completo del usuario' })
  name: string;

  @IsString()
  @ApiProperty({ example: 'johndoe', description: 'Nombre de usuario único' })
  username: string;

  @IsEmail()
  @ApiProperty({ example: 'john@example.com', description: 'Correo electrónico del usuario' })
  email: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: '+521234567890', description: 'Número de teléfono del usuario (opcional)' })
  phone?: string;

  @IsString()
  @IsOptional()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(100, { message: 'Password must not exceed 100 characters' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).+$/, {
      message: 'The password must contain at least one lowercase letter, one uppercase letter, one number, and one special character (!@#$%^&*).',
  })
  @ApiPropertyOptional({ 
      example: 'Abc123!@#', 
      description: 'Contraseña del usuario (mínimo 8 caracteres, al menos una mayúscula, una minúscula, un número y un caracter especial)' 
  })
  password?: string;

  @IsString()
  @IsOptional()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(100, { message: 'Password must not exceed 100 characters' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).+$/, {
      message: 'The password must contain at least one lowercase letter, one uppercase letter, one number, and one special character (!@#$%^&*).',
  })
  @ApiPropertyOptional({ 
      example: 'Abc123!@#', 
      description: 'Confirmación de contraseña del usuario, debe coincidir con la contraseña' 
  })
  confirmPassword?: string;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({ example: false, description: 'Indica si el usuario tiene permisos de administrador' })
  isAdmin?: boolean;
}
