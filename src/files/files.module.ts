import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Module({
    controllers: [FilesController],
    providers: [FilesService, CloudinaryService],
    exports: [FilesService]
})
export class FilesModule {}