// src/pins/pinsDtos/comments.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CommentDto {
  @ApiProperty({ example: 'Love this style!' })
  @IsString()
  @IsNotEmpty()
  text: string;
}
