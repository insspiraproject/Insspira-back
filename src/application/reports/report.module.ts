import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportService } from './report.service';

import { Report } from '../../entities/report.entity';
import { User } from 'src/entities/user.entity';
import { ReportController } from 'src/rest/controller/report.controller';


@Module({
  imports: [TypeOrmModule.forFeature([User, Report])],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}
