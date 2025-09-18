import { IsEmail, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class LoginUserDto {

  @IsEmail()
  @ApiProperty({ 
      example: 'john@example.com', 
      description: 'Correo electrónico del usuario para login' 
  })
  email: string;

  @IsString()
  @IsOptional()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(100, { message: 'Password must not exceed 100 characters' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).+$/, {
      message: 'The password must contain at least one lowercase letter, one uppercase letter, one number, and one special character (!@#$%^&*).',
  })
  @ApiPropertyOptional({ 
      example: 'Abc123!@#', 
      description: 'Contraseña del usuario para login (mínimo 8 caracteres, al menos una mayúscula, una minúscula, un número y un carácter especial)' 
  })
  password?: string;
}
