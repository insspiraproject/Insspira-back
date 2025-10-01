// src/admin/admin.controller.ts
import { Controller, Get, Query, UseGuards, Patch, Param, Body, Post, Delete } from '@nestjs/common';
import { AdminGuard } from './admin.guard';
import { AdminService } from './admin.service';
import { PatchUserRoleDto, PatchUserStatusDto, UpsertPlanDto } from './admin.dto';
import { UserStatus } from 'src/status.enum';


@UseGuards(AdminGuard)
@Controller('admin')
export class AdminController {
  
  constructor(private readonly svc: AdminService) {}

  @Get('overview')
  overview() { return this.svc.overview(); }

  @Get('users')
  users(@Query('q') q = '', @Query('page') page = '1', @Query('limit') limit = '20') {
    return this.svc.listUsers(q, Number(page) || 1, Number(limit) || 20);
  }

  @Patch('users/status/:id')
  patchUserStatus(@Param('id') id: string, @Body() dto: PatchUserStatusDto) {
    return this.svc.patchUserStatus(id, dto.status as UserStatus);
  }

  @Patch('users/:id/role')
  patchUserRole(@Param('id') id: string, @Body() dto: PatchUserRoleDto) {
    return this.svc.patchUserRole(id, dto.isAdmin);
  }

  @Get('reports')
  reports() { return this.svc.listReports(); }

  @Patch('reports/:id')
  async patchReport(@Param('id') id: string, @Body() body: { status: 'reviewed'|'resolved'|'dismissed' }) {
    this.svc.patchReportStatus(id, body.status);
    return {message: "The status of the report was changed with output"} 
      
  }

  @Get('subscriptions')
  subs() { return this.svc.listSubscriptions(); }

  @Get('payments')
  payments() { return this.svc.listPayments(); }

  @Get('plans')
  plans() { return this.svc.listPlans(); }

  @Patch('plans/toggle/:id')
  togglePlan(@Param('id') id: string) {
    return this.svc.togglePlanActive(id);
  }

   @Delete('plans/:id')
  deletePlan(@Param('id') id: string) {
    return this.svc.deletePlan(id);
  }

  // @Patch('plans/:id')
  // updatePlan(@Param('id') id: string, @Body() dto: UpsertPlanDto) {
  //   return this.svc.upsertPlan({ ...dto, id });
  // }

  // @Post('plans')
  // upsertPlan(@Body() dto: UpsertPlanDto) {
  //   return this.svc.upsertPlan(dto);
  // }

 
}