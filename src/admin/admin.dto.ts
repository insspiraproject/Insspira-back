// src/admin/admin.dto.ts
import { IsBoolean, IsIn, IsOptional, IsString, IsUUID, IsNumber, Min } from 'class-validator';

export class PatchUserStatusDto {
  @IsIn(['active','suspended']) status: 'active' | 'suspended';
}

export class PatchUserRoleDto {
  @IsBoolean() isAdmin: boolean;
}

export class UpsertPlanDto {
  @IsOptional() @IsUUID() id?: string;

  @IsString() name: string;

  @IsNumber() @Min(0) pricePerMonth: number;

  @IsIn(['USD','COP','ARS'])
  currency: 'USD'|'COP'|'ARS';

  @IsString() featuresCsv: string;

  @IsBoolean() isActive: boolean;

  // 👇 Antes: @IsOptional() @IsString() type?: string;
  @IsOptional()
  @IsIn(['free','monthly','annual'])
  type?: 'free'|'monthly'|'annual';
}
