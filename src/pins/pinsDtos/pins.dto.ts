import { IsString, IsUrl, IsUUID, Length } from "class-validator"

export class pinsDto {
    @IsUrl({}, { message: "Image has to be a valid URL" })
    image: string;

    @IsString({ message: "Desciption must be a string" })
    @Length(3, 200, { message: "Description must be between 3 and 200 characters" })
    description: string;

    @IsUUID("4", { message: "Category must be a valid UUID" })
    categoryId: string;

    @IsUUID("4", { message: "Category must be a valid UUID" })
    userId: string;
}

