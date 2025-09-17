import { IsEmail, IsNotEmpty } from 'class-validator';

export class LikeNotificationDto {
  @IsEmail()
  recipientEmail: string;

  @IsNotEmpty()
  photoTitle: string;
}

export class CommentNotificationDto {
  @IsEmail()
  recipientEmail: string;

  @IsNotEmpty()
  photoTitle: string;

  @IsNotEmpty()
  comment: string;
}
