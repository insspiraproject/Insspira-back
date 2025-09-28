import { IsEnum, IsOptional, IsString } from "class-validator";
import { ReportStatus, ReportType } from "src/report.enum";

export class UpdateReportDto {
  @IsOptional()
  @IsEnum(ReportType)
  type?: ReportType;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsEnum(ReportStatus)
  status?: ReportStatus;
}
