import { IsEmail, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class LoginUserDto {
    @IsEmail()
    email: string;

    @IsString()
    @IsOptional() 
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @MaxLength(100, { message: 'Password must not exceed 100 characters' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).+$/, {
            message: 'The password must contain at least one lowercase letter, one uppercase letter, one number, and one special character (!@#$%^&*).',
        })
        password?: string;
}