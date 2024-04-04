import { Exclude } from 'class-transformer';
import { randomUUID } from 'crypto';
import { Sex, CivilState } from '@prisma/client';

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

  constructor() {
    this.id = randomUUID();
  }
}
