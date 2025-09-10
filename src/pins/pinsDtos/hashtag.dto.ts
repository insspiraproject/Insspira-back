import { IsString} from "class-validator";

export class HashtagDto {
  @IsString()  
  tag: string;
}

