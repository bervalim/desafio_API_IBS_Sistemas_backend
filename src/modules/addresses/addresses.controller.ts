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
  ForbiddenException,
  HttpCode,
} from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('addresses')
@Controller('addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  async create(@Body() createAddressDto: CreateAddressDto, @Request() req) {
    const createdAddress = await this.addressesService.create(
      createAddressDto,
      req.user.id,
    );
    return createdAddress;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  findAll(@Request() req) {
    const { page, limit } = req.query;
    if (req.user.admin) {
      return this.addressesService.findAll(page, limit);
    } else {
      throw new ForbiddenException(
        'Você não tem permissão para acessar esta rota',
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    const oneAdress = await this.addressesService.findOne(id);
    if (req.user.admin == true || req.user.id == oneAdress.personId) {
      return oneAdress;
    } else {
      throw new ForbiddenException(
        'Você não tem permissão para acessar esta rota',
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAddressDto: UpdateAddressDto,
    @Request() req,
  ) {
    const oneAdress = await this.addressesService.findOne(id);
    if (req.user.admin == true || req.user.id === oneAdress.personId) {
      return this.addressesService.update(id, updateAddressDto);
    } else {
      throw new ForbiddenException(
        'Você não tem permissão para acessar esta rota',
      );
    }
  }

  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    const oneAdress = await this.addressesService.findOne(id);
    if (req.user.admin == true || req.user.id === oneAdress.personId) {
      return this.addressesService.remove(id);
    } else {
      throw new ForbiddenException(
        'Você não tem permissão para acessar esta rota',
      );
    }
  }
}
