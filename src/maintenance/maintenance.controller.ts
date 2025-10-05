import { Controller, Get, Post, Body } from '@nestjs/common';
import { MaintenanceService } from './maintenance.service';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { UpdateMaintenanceDto } from './dto/update-maintenance.dto';
import { MaintenanceGateway } from './maintenance.gateway';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Maintenance')
@Controller('maintenance')
export class MaintenanceController {
  constructor(
    private readonly maintenanceService: MaintenanceService,
    private readonly gateway: MaintenanceGateway,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Enable or disable maintenance mode',
    description:
      'Switches the application state to maintenance mode (`true`) or normal mode (`false`). Also broadcasts the new status via WebSocket.',
  })
  @ApiResponse({
    status: 201,
    description: 'Maintenance status updated successfully.',
    schema: {
      example: { active: true },
    },
  })
  async toggle(@Body('active') active: boolean) {
    const status = this.maintenanceService.setStatus(active);
    this.gateway.sendMaintenanceStatus(status);
    return { active: status };
  }

  @Get()
  @ApiOperation({
    summary: 'Get current maintenance status',
    description:
      'Returns whether the application is currently in maintenance mode (`true`) or normal mode (`false`).',
  })
  @ApiResponse({
    status: 200,
    description: 'Current maintenance status retrieved successfully.',
    schema: {
      example: { active: false },
    },
  })
  async getStatus() {
    return { active: await this.maintenanceService.getStatus() };
  }
}
