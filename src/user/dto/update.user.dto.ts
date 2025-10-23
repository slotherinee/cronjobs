import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsEmail()
  @IsOptional()
  @Length(3, 255)
  email?: string;

  @IsString()
  @IsOptional()
  @Length(6, 255)
  password?: string;
}
