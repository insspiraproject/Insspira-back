import { IsUUID } from "class-validator";

export class CreateLikeDto {
  @IsUUID("4", { message: "ID pin must be a valid UUID" })
  pinId: string;
}




