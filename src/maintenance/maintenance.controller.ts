import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MaintenanceService } from './maintenance.service';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { UpdateMaintenanceDto } from './dto/update-maintenance.dto';
import { MaintenanceGateway } from './maintenance.gateway';

@Controller('maintenance')
export class MaintenanceController {
  constructor(private readonly maintenanceService: MaintenanceService,
    private readonly gateway: MaintenanceGateway) {}

  @Post()
    async toggle(@Body('active') active: boolean) {
      const status = this.maintenanceService.setStatus(active);
      this.gateway.sendMaintenanceStatus(status);
      return {active: status};
    }

    @Get()
    async getStatus() {
      return { active: await this.maintenanceService.getStatus() };
    }
    

}
