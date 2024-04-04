import { randomUUID } from 'crypto';

export class Address {
  readonly id: string;
  zipCode: string;
  address: string;
  number: number;
  complement: string;
  neighborhood: string;
  state: string;
  city: string;
  person_id?: string;

  constructor() {
    this.id = randomUUID();
  }
}
