import { IsUUID } from "class-validator";

export class CreateSubsDto {
  @IsUUID("4", { message: "ID pin must be a valid UUID" })
  plan_id: string;

  @IsUUID("4", { message: "ID pin must be a valid UUID" })
  user_id: string;
}