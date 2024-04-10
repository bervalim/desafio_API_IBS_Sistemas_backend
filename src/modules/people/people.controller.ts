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
  ForbiddenException,
  HttpCode,
} from '@nestjs/common';
import { PeopleService } from './people.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('people')
@Controller('people')
export class PeopleController {
  constructor(private readonly peopleService: PeopleService) {}

  @Post()
  create(@Body() createPersonDto: CreatePersonDto) {
    return this.peopleService.create(createPersonDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiBearerAuth()
  findAll(@Query() query: any, @Request() req) {
    const { page, limit } = req.query;
    if (req.user.admin == true) {
      return this.peopleService.findAll(page, limit, query);
    } else {
      throw new ForbiddenException(
        'Você não tem permissão para acessar esta rota',
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiBearerAuth()
  findOne(@Param('id') id: string, @Request() req) {
    if (req.user.admin == true || id == req.user.id) {
      return this.peopleService.findOne(id);
    } else {
      throw new ForbiddenException(
        'Você não tem permissão para acessar esta rota',
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiBearerAuth()
  update(
    @Param('id') id: string,
    @Body() updatePersonDto: UpdatePersonDto,
    @Request() req,
  ) {
    if (req.user.admin == true || id == req.user.id) {
      return this.peopleService.update(id, updatePersonDto);
    } else {
      throw new ForbiddenException(
        'Você não tem permissão para acessar esta rota',
      );
    }
  }

  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiBearerAuth()
  remove(@Param('id') id: string, @Request() req) {
    if (req.user.admin == true || id == req.user.id) {
      return this.peopleService.remove(id);
    } else {
      throw new ForbiddenException(
        'Você não tem permissão para acessar esta rota',
      );
    }
  }
}
