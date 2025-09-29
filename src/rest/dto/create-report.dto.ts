import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
import { ReportTarget, ReportType } from "src/rest/types/report.enum";

export class CreateReportDto {
  @IsEnum(ReportTarget)
  targetType: ReportTarget;

  @IsUUID()
  targetId: string;

  @IsEnum(ReportType)
  type: ReportType;

  @IsOptional()
  @IsString()
  reason?: string;
}
