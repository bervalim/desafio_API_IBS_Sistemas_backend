import {
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateAddressDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(8)
  zipCode: string;
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  address: string;
  @IsNumber()
  @IsNotEmpty()
  number: number;
  @IsString()
  @IsNotEmpty()
  @MaxLength(40)
  complement: string;
  @IsString()
  @IsNotEmpty()
  @MaxLength(40)
  neighborhood: string;
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(2)
  state: string;
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  city: string;
}
