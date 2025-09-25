import { Controller, Get, Query } from '@nestjs/common';
import { FilesService } from './files.service';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get('signature')
  @ApiOperation({
    summary: 'Generate an upload signature for file storage',
    description:
      'Generates a secure upload signature for a given folder to allow direct file uploads to the storage service. Defaults to "uploads" folder if none is provided.',
  })
  @ApiQuery({
    name: 'folder',
    required: false,
    description: 'The target folder where the file will be uploaded (optional, defaults to "uploads")',
    example: 'user-avatars',
  })
  async getUploadSignature(@Query('folder') folder: string) {
    return this.filesService.getUploadSignature(folder || 'uploads');
  }
}
