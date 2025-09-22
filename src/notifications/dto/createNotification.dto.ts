import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateNotificationDto {
  @IsEmail()
  recipientEmail: string;

  @IsNotEmpty()
  type: 'like' | 'comment';

  @IsNotEmpty()
  photoTitle: string;

  @IsOptional()
  comment?: string;
}
