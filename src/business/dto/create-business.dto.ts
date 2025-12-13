import { IsString, IsEmail, MinLength } from 'class-validator';

export class CreateBusinessDto {
  @IsEmail() business_email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
