import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { PeopleService } from '../people/people.service';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { CivilState } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private peopleService: PeopleService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const person = await this.peopleService.findByEmail(loginDto.email);

    if (!person) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const comparePassswords = await compare(loginDto.password, person.password);

    if (!comparePassswords) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return {
      token: this.jwtService.sign(
        { email: person.email, admin: person.admin },
        { subject: person.id, secret: process.env.SECRET_KEY },
      ),
      person: {
        civilState: person.civilState,
        birthDate: person.birthDate,
        sex: person.sex,
        name: person.name,
        email: person.email,
        id: person.id,
      },
    };
  }
}
