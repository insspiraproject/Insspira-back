// src/pins/pinsDtos/hashtag.dto.ts
import { IsString} from "class-validator";
import { ApiProperty } from '@nestjs/swagger';
export class HashtagDto {
  @ApiProperty({ example: '#photography' })
  @IsString()  
  tag: string;
}
