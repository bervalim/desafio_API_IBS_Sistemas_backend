import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'; // Import corrected decorators
import { Sex, CivilState } from '@prisma/client';
import { hashSync } from 'bcryptjs';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreatePersonDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  name: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(45)
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(80)
  @Transform(({ value }: { value: string }) => hashSync(value, 10), {
    groups: ['transform'],
  })
  password: string;

  @ApiProperty({ enum: Sex, description: 'Enum que representa os sexos' }) // Combine description and enum
  @IsNotEmpty()
  @IsEnum(Sex)
  sex: Sex;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  birthDate: string;

  @ApiProperty({
    enum: CivilState,
    description: 'Enum que representa o estado civil',
  }) // Combine description and enum
  @IsNotEmpty()
  @IsEnum(CivilState)
  civilState: CivilState;

  @ApiPropertyOptional() // Mark as optional
  @IsBoolean()
  admin: boolean;
}
