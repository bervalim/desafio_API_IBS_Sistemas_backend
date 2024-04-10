import { PartialType } from '@nestjs/swagger';
import { CreatePersonDto } from './create-person.dto';
import { Person } from '../entities/person.entity';

export type TUpdatePersonWithoutAdmin = Omit<Person, 'admin' | 'id'>;
export type PartialUpdate = Partial<TUpdatePersonWithoutAdmin>;

export class UpdatePersonDto
  extends PartialType(CreatePersonDto)
  implements PartialUpdate {}
