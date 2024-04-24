import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async login(loginDto: LoginDto) {
    const person = await this.prisma.person.findUnique({
      where: { email: loginDto.email },
    });

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
