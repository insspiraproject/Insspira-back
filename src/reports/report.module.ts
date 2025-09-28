import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { User } from 'src/users/entities/user.entity';
import { Report } from './report.entity';


@Module({
  imports: [TypeOrmModule.forFeature([User, Report])],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}
