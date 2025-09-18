import { IsString, IsUrl } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UploadFileDto {

    @IsString()
    @ApiProperty({
        description: 'Nombre del archivo',
        example: 'foto_perfil.png'
    })
    fileName: string;

    @IsString()
    @ApiProperty({
        description: 'Tipo MIME del archivo',
        example: 'image/png'
    })
    mimeType: string;

    @IsUrl()
    @ApiProperty({
        description: 'URL donde se pueda acceder al archivo',
        example: 'https://miapp.com/files/foto_perfil.png'
    })
    url: string;
}
