import { Injectable } from '@nestjs/common';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { UpdateMaintenanceDto } from './dto/update-maintenance.dto';

@Injectable()
export class MaintenanceService {
  private isActive = false;

  async getStatus() {
    return this.isActive;
  }

  setStatus(active: boolean){
    this.isActive = active;
    return this.isActive;
  }
}
