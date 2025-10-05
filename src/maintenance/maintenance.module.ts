import { Module } from '@nestjs/common';
import { MaintenanceService } from './maintenance.service';
import { MaintenanceController } from './maintenance.controller';
import { MaintenanceGateway } from './maintenance.gateway';

@Module({
  controllers: [MaintenanceController],
  providers: [MaintenanceService, MaintenanceGateway],
})
export class MaintenanceModule {}
