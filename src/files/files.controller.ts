import { Controller, Get, Query } from '@nestjs/common';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
    constructor(private readonly filesService: FilesService) {}

    @Get('signature')
    async getUploadSignature(@Query('folder') folder: string) {
        return this.filesService.getUploadSignature(folder || 'uploads');
    }
}