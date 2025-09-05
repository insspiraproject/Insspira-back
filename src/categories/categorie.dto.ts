import { IsString } from "class-validator";

export class categoriDto {
  @IsString()
  name: string;
}


