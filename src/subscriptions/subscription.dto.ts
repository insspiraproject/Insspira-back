import { IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateSubsDto {
  @ApiProperty({
    description: "UUID del plan al que el usuario se suscribe",
    example: "a3e2d7d8-8b4c-4c9f-a123-9a1234567890"
  })
  @IsUUID("4", { message: "ID plan must be a valid UUID" })
  plan_id: string;

  @ApiProperty({
    description: "UUID del usuario que realiza la suscripción",
    example: "b7e5f1a2-4c8d-45f3-b9c9-8d1234567890"
  })
  @IsUUID("4", { message: "ID user must be a valid UUID" })
  user_id: string;
}
