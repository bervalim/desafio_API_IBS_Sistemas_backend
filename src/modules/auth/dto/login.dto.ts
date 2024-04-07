import {
  IsString,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsEmail,
} from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(45)
  email: string;
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(80)
  password: string;
}
