import { Exclude } from 'class-transformer';
import { randomUUID } from 'crypto';
import { Sex, CivilState } from '@prisma/client';
import { Address } from 'src/modules/addresses/entities/address.entity';

export class Person {
  readonly id: string;
  name: string;
  email: string;
  @Exclude()
  password: string;
  sex: Sex;
  birthDate: string;
  civilState: CivilState;
  admin: boolean;
  addresses: Address[] | undefined;

  constructor() {
    this.id = randomUUID();
  }
}
