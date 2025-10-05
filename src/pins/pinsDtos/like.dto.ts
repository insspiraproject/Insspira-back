// src/pins/pinsDtos/like.dto.ts
import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLikeDto {

  @ApiProperty({ example: 'c0f1f8d7-40d7-42af-af3b-35806a8b9d9e' })
  @IsUUID('4', { message: 'ID pin must be a valid UUID' })
  pinId: string;
  
}
