import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateAdoptionApplicationDto {
  @IsInt()
  @Min(1)
  animalId: number;

  @IsOptional()
  @IsString()
  message?: string;
}
