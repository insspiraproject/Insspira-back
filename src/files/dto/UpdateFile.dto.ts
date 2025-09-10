import { PartialType } from '@nestjs/mapped-types';
import { UploadFileDto } from './UploadFile.dto';

export class UpdateFileDto extends PartialType(UploadFileDto) {}
