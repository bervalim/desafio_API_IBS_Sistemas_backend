import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PeopleService } from '../people/people.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, PeopleService, JwtService, PrismaService],
})
export class AuthModule {}
