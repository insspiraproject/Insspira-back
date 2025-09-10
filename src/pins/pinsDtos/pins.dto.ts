import { PartialType } from "@nestjs/mapped-types";
import { ArrayNotEmpty, IsArray, IsString, IsUrl, IsUUID, Length } from "class-validator"

export class pinsDto {
    @IsUrl({}, { message: "Image has to be a valid URL" })
    image: string;

    @IsString({ message: "Desciption must be a string" })
    @Length(3, 200, { message: "Description must be between 3 and 200 characters" })
    description: string;
}

export class updateDto extends  PartialType(pinsDto){}