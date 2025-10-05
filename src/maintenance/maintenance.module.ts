import { Module } from '@nestjs/common';
import { MaintenanceService } from './maintenance.service';
import { MaintenanceController } from './maintenance.controller';
import { MaintenanceGateway } from './maintenance.getway';

@Module({
  controllers: [MaintenanceController],
  providers: [MaintenanceService, MaintenanceGateway],
})
export class MaintenanceModule {}
