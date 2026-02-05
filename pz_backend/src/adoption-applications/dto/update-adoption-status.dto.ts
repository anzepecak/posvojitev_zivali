import { IsEnum } from 'class-validator';
import { AdoptionStatus } from '../adoption-application.entity';

export class UpdateAdoptionStatusDto {
  @IsEnum(AdoptionStatus)
  status: AdoptionStatus;
}
