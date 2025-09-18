import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LikeNotificationDto {
  @IsEmail()
  @ApiProperty({example: 'usuario@example.com'})
  recipientEmail: string;

  @IsNotEmpty()
  @ApiProperty({example: 'Mi paisaje favorito'})
  photoTitle: string;
}

export class CommentNotificationDto {
  @IsEmail()
  @ApiProperty({example: 'usuario@example.com'})
  recipientEmail: string;

  @IsNotEmpty()
  @ApiProperty({example: 'Una tarde maravillosa'})
  photoTitle: string;

  @IsNotEmpty()
  @ApiProperty({example: 'Excelente fotografía'})
  comment: string;
}
