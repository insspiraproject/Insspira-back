import { IsUUID } from "class-validator";

export class CreateLikeDto {
  @IsUUID("4", { message: "El ID del pin debe ser un UUID válido" })
  pinId: string;
}




