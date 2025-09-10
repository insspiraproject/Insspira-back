import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('cloudinary')
export class CloudinaryController {
    constructor(private readonly cloudinaryService: CloudinaryService) {}

    @UseGuards(AuthGuard('jwt'))
    @Get('signature')
    getSignature(@Req() req) {
        
        const userId = req.user.id; 

        const folder = `pins/${userId}`;

        return this.cloudinaryService.generateUploadSignature(folder);
    }
}