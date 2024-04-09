import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
  Query,
} from '@nestjs/common';
import { PeopleService } from './people.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin-auth.guard';

@Controller('people')
export class PeopleController {
  constructor(private readonly peopleService: PeopleService) {}

  @Post()
  create(@Body() createPersonDto: CreatePersonDto) {
    return this.peopleService.create(createPersonDto);
  }

  @UseGuards(AdminGuard, JwtAuthGuard)
  @Get()
  findAll(@Query() query: any, @Request() req) {
    console.log('-------', req.user, '------');
    const { page, limit } = req.query;
    return this.peopleService.findAll(page, limit, query);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.peopleService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePersonDto: UpdatePersonDto) {
    return this.peopleService.update(id, updatePersonDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.peopleService.remove(id);
  }
}
