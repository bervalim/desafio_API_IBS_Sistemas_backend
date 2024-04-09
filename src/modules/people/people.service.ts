import {
  ConflictException,
  HttpCode,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { PrismaService } from 'prisma/prisma.service';
import { Person } from './entities/person.entity';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class PeopleService {
  constructor(private prisma: PrismaService) {}

  async create(createPersonDto: CreatePersonDto) {
    const findPerson = await this.prisma.person.findUnique({
      where: { email: createPersonDto.email },
    });

    if (findPerson) {
      throw new ConflictException('Email already exists');
    }

    const newPerson = Object.assign(new Person(), createPersonDto);

    // Extrai o dia, mês e ano do formato "dd/mm/yyyy"
    const [day, month, year] = createPersonDto.birthDate.split('/').map(Number);

    // Cria um novo objeto Date com o formato correto
    const birthDate = new Date(year, month - 1, day);
    const currentDay = new Date();

    // Calcula a idade corretamente
    let personAge = currentDay.getFullYear() - birthDate.getFullYear();
    if (
      currentDay.getMonth() < birthDate.getMonth() ||
      (currentDay.getMonth() === birthDate.getMonth() &&
        currentDay.getDate() < birthDate.getDate())
    ) {
      personAge--;
    }

    // Cria uma nova data para o próximo aniversário
    const nextBirthday = new Date(
      currentDay.getFullYear(),
      birthDate.getMonth(),
      birthDate.getDate(),
    );
    if (
      currentDay.getMonth() > birthDate.getMonth() ||
      (currentDay.getMonth() === birthDate.getMonth() &&
        currentDay.getDate() >= birthDate.getDate())
    ) {
      nextBirthday.setFullYear(currentDay.getFullYear() + 1);
    }

    // Calcula os dias até o próximo aniversário
    const daysUntilNextBirthday = Math.ceil(
      (nextBirthday.getTime() - currentDay.getTime()) / (1000 * 3600 * 24),
    );

    await this.prisma.person.create({ data: { ...newPerson } });

    // Verifica se é o aniversário hoje
    if (
      currentDay.getMonth() === birthDate.getMonth() &&
      currentDay.getDate() === birthDate.getDate()
    ) {
      return {
        person: plainToInstance(Person, newPerson),
        age: personAge,
        message: 'Parabéns pelo seu aniversário!',
      };
    } else {
      return {
        person: plainToInstance(Person, newPerson),
        age: personAge,
        daysUntilNextBirthday,
      };
    }
  }

  async findAll(
    page = 1,
    limit = 5,
    query?: any,
  ): Promise<{
    data: Person[];
    count: number;
    next?: string;
    previous?: string;
  }> {
    const where: any = {};
    const totalCount = await this.prisma.person.count();
    const skip = (parseInt(page.toString()) - 1) * parseInt(limit.toString());
    const take = parseInt(limit.toString());

    // Aplicando os filtros do req.query:
    if (query) {
      if (query.civilState) {
        where.civilState = query.civilState;
      }
      if (query.sex) {
        where.sex = query.sex;
      }
    }

    const people = await this.prisma.person.findMany({ where, skip, take });
    const nextPage =
      skip + take < totalCount
        ? `http://localhost:3000/people/?page=${page + 1}`
        : null;
    const previousPage =
      page > 1 ? `http://localhost:3000/people/?page=${page - 1}` : null;

    return {
      count: totalCount,
      next: nextPage,
      previous: previousPage,
      data: plainToInstance(Person, people),
    };
  }

  async findOne(id: string): Promise<Person> {
    const person = await this.prisma.person.findUnique({
      where: { id: id },
      include: {
        addresses: true,
      },
    });
    if (!person) {
      throw new NotFoundException('Person Not Found!');
    }
    return plainToInstance(Person, person);
  }

  async findByEmail(email: string): Promise<Person | undefined> {
    const personEmail = await this.prisma.person.findUnique({
      where: { email: email },
    });

    return personEmail;
  }

  async update(id: string, updatePersonDto: UpdatePersonDto) {
    const person = await this.prisma.person.findUnique({
      where: { id: id },
    });
    if (!person) {
      throw new NotFoundException('Person Not Found!');
    }

    const updatedPerson = await this.prisma.person.update({
      where: { id },
      data: {
        name: updatePersonDto.name,
        email: updatePersonDto.email,
        password: updatePersonDto.password,
        sex: updatePersonDto.sex,
        birthDate: updatePersonDto.birthDate,
        civilState: updatePersonDto.civilState,
      },
    });

    delete updatedPerson.password;
    return updatedPerson;
  }

  @HttpCode(204)
  async remove(id: string): Promise<void> {
    const person = await this.prisma.person.findUnique({
      where: { id: id },
    });
    if (!person) {
      throw new NotFoundException('Person Not Found!');
    }
    await this.prisma.person.delete({ where: { id } });
  }
}
