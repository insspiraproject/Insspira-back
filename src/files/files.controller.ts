import { Controller, Get, Query } from '@nestjs/common';
import { FilesService } from './files.service';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';

@ApiTags('Files')
@Controller('files')
export class FilesController {
    constructor(private readonly filesService: FilesService) {}

    @Get('signature')
    @ApiOperation({ summary: 'Obtener la firma para subir archivos a un folder específico' })
    @ApiQuery({ 
        name: 'folder', 
        required: false, 
        description: 'Nombre de la carpeta donde se subirá el archivo', 
        example: 'uploads' 
    })
    async getUploadSignature(@Query('folder') folder: string) {
        return this.filesService.getUploadSignature(folder || 'uploads');
    }
}
