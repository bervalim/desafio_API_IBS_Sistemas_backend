import { Sex, CivilState } from '@prisma/client';
import { hashSync } from 'bcrypt';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreatePersonDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  name: string;
  @IsString()
  @IsNotEmpty()
  @MaxLength(45)
  email: string;
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(80)
  @Transform(({ value }: { value: string }) => hashSync(value, 10), {
    groups: ['transform'],
  })
  password: string;
  @IsNotEmpty()
  @IsEnum(Sex)
  sex: Sex;
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  birthDate: string;
  @IsNotEmpty()
  @IsEnum(CivilState)
  civilState: CivilState;
  @IsBoolean()
  @IsOptional()
  admin: boolean;
}
