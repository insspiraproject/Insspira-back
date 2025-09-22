import { Injectable } from '@nestjs/common';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class FilesService {
    constructor(private readonly cloudinaryService: CloudinaryService) {}

    async getUploadSignature(folder: string) {
        return this.cloudinaryService.generateUploadSignature(folder);
    }
}