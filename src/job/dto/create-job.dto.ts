import {
  IsString,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsIn,
} from 'class-validator';

export class CreateJobDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  url: string;

  @IsString()
  @IsIn(['GET', 'POST', 'PUT', 'PATCH', 'DELETE'])
  @IsOptional()
  method?: string;

  @IsString()
  @IsOptional()
  headers?: string;

  @IsString()
  @IsOptional()
  body?: string;

  @IsString()
  @IsNotEmpty()
  schedule: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
