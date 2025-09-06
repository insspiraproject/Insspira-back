import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('cloudinary')
export class CloudinaryController {
    constructor(private readonly cloudinaryService: CloudinaryService) {}

    @UseGuards(AuthGuard('jwt'))
    @Get('signature')
    getSignature(@Query('folder') folder: string) {
        return this.cloudinaryService.generateUploadSignature(folder || 'pinterest');
    }
}