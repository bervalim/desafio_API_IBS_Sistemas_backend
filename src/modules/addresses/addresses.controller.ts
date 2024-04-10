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
  Query,
} from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('addresses')
@Controller('addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  @ApiBody({
    description: 'Create a new address.',
    schema: {
      example: {
        zipCode: '80730330',
        address: 'Rua Y',
        number: 864,
        complement: 'Apto 701',
        neighborhood: 'Bigorrilho',
        state: 'PR',
        city: 'Curitiba',
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Address created successfully.',
    schema: {
      example: {
        id: '7659f33d-5316-450a-8f28-9d4477d00e8f',
        zipCode: '80730330',
        address: 'Rua Y',
        number: 864,
        complement: 'Apto 701',
        neighborhood: 'Bigorrilho',
        state: 'PR',
        city: 'Curitiba',
        personId: '0f318af5-ba88-4ec5-b901-c0009a91b9c1',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. Check error message for details.',
    schema: {
      example: {
        message: [
          'zipCode must be shorter than or equal to 8 characters',
          'zipCode should not be empty',
          'zipCode must be a string',
        ],
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Absence of token',
    schema: {
      example: {
        message: 'Unauthorized',
      },
    },
  })
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
  @ApiQuery({ name: 'page', description: 'Page Number', required: false })
  @ApiQuery({
    name: 'limit',
    description: 'Maximum number of results per page',
    required: false,
  })
  @ApiQuery({
    name: 'zipCode',
    description: 'address zipCode',
  })
  @ApiQuery({
    name: 'neighborhood',
    description: 'address neighborhood',
  })
  @ApiQuery({
    name: 'city',
    description: 'address city',
  })
  @ApiQuery({
    name: 'state',
    description: 'address state',
  })
  @ApiResponse({
    status: 200,
    description: 'List of addresses fetched successfully.',
    schema: {
      example: {
        count: 26,
        next: 'http://localhost:3000/addresses/?page=11',
        previous: null,
        data: [
          {
            id: '5154c6db-35ed-4868-bb2a-88265e835103',
            zipCode: '80730330',
            address: 'Rua Coronel Xdd',
            number: 864,
            complement: 'Apto 701',
            neighborhood: 'Bigorrilho',
            state: 'PR',
            city: 'Curitiba',
            personId: '89ffa6ee-644d-4c70-9bd8-78256ee06c8f',
          },
          {
            id: '66fbb929-12a7-4988-bf24-cb2e954622b7',
            zipCode: '80730330',
            address: 'Rrddfdrerrdfrrdrduededa Coedrfodnel Xdedddd',
            number: 864,
            complement: 'Apto 701',
            neighborhood: 'Bigorrilho',
            state: 'PR',
            city: 'Curitiba',
            personId: '0f318af5-ba88-4ec5-b901-c0009a91b9c1',
          },
          {
            id: '6afbf2a7-4424-4cf8-84f7-0a41726aa3af',
            zipCode: '80730330',
            address: 'Rrdfrrdrduededa Coedrfodnel Xdedddd',
            number: 864,
            complement: 'Apto 701',
            neighborhood: 'Bigorrilho',
            state: 'PR',
            city: 'Curitiba',
            personId: 'bbc21f2b-43b1-4270-a0db-124b02d1accc',
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Absence of token',
    schema: {
      example: {
        message: 'Unauthorized',
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'non-admin user',
    schema: {
      example: {
        message: 'You do not have permission to access this route',
      },
    },
  })
  findAll(@Query() query: any, @Request() req) {
    const { page, limit } = req.query;
    if (req.user.admin) {
      return this.addressesService.findAll(page, limit, query);
    } else {
      throw new ForbiddenException(
        'You do not have permission to access this route',
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Address details fetched successfully.',
    schema: {
      example: {
        id: '034f7440-b6cb-4c1c-acf8-b626f1ae1abc',
        zipCode: '80730330',
        address: 'Endedereço Atualizado',
        number: 864,
        complement: 'Apto 701',
        neighborhood: 'Bigorrilho',
        state: 'PR',
        city: 'Curitiba',
        personId: '89ffa6ee-644d-4c70-9bd8-78256ee06c8f',
        person: {
          name: 'Pantaleãot',
          email: 'bernardogvalim@eemadil.com',
          sex: 'Male',
          birthDate: '16/05/1998',
          civilState: 'Married',
          admin: true,
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Absence of token',
    schema: {
      example: {
        message: 'Unauthorized',
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'non-admin user or does not own the account',
    schema: {
      example: {
        message: 'You do not have permission to access this route',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Address Not Found!',
    schema: {
      example: {
        message: 'Address Not Found!',
      },
    },
  })
  async findOne(@Param('id') id: string, @Request() req) {
    const oneAdress = await this.addressesService.findOne(id);
    if (req.user.admin == true || req.user.id == oneAdress.personId) {
      return oneAdress;
    } else {
      throw new ForbiddenException(
        'You do not have permission to access this route',
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  @ApiBody({
    description: 'Update address details.',
    schema: {
      example: {
        zipCode: '80730330',
        address: 'Endedereço Atualizado',
        number: 864,
        complement: 'Apto 701',
        neighborhood: 'Bigorrilho',
        state: 'PR',
        city: 'Curitiba',
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Address details updated successfully.',
    schema: {
      example: {
        id: '5154c6db-35ed-4868-bb2a-88265e835103',
        zipCode: '80730330',
        address: 'Endedereço Atualizado',
        number: 864,
        complement: 'Apto 701',
        neighborhood: 'Bigorrilho',
        state: 'PR',
        city: 'Curitiba',
        personId: '89ffa6ee-644d-4c70-9bd8-78256ee06c8f',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Absence of token',
    schema: {
      example: {
        message: 'Unauthorized',
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'non-admin user or does not own the account',
    schema: {
      example: {
        message: 'You do not have permission to access this route',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Address Not Found!',
    schema: {
      example: {
        message: 'Address Not Found!',
      },
    },
  })
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
        'You do not have permission to access this route',
      );
    }
  }

  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiResponse({
    status: 401,
    description: 'Absence of token',
    schema: {
      example: {
        message: 'Unauthorized',
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'non-admin user or does not own the account',
    schema: {
      example: {
        message: 'You do not have permission to access this route',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Address Not Found!',
    schema: {
      example: {
        message: 'Address Not Found!',
      },
    },
  })
  @ApiResponse({
    status: 204,
    description: 'Address deleted successfully.',
  })
  async remove(@Param('id') id: string, @Request() req) {
    const oneAdress = await this.addressesService.findOne(id);
    if (req.user.admin == true || req.user.id === oneAdress.personId) {
      return this.addressesService.remove(id);
    } else {
      throw new ForbiddenException(
        'You do not have permission to access this route',
      );
    }
  }
}
