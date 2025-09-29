import { Module } from '@nestjs/common';
import { FilesController } from '../../rest/controller/files.controller';
import { FilesService } from './files.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CloudinaryConfig } from '../../config/cloudinary';

@Module({
    controllers: [FilesController],
    providers: [FilesService, CloudinaryService, CloudinaryConfig],
    exports: [FilesService]
})
export class FilesModule {}