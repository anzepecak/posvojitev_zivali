import { IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class UpdateAnimalDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  species?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  age?: number;

  @IsOptional()
  @IsString()
  description?: string;
}
