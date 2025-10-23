import { IsEmail, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsEmail()
  @Length(3, 255)
  email: string;

  @IsString()
  @Length(6, 255)
  password: string;
}
