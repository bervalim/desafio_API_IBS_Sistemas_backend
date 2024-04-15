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
import {
  ApiBearerAuth,
  ApiTags,
  ApiBody,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('people')
@Controller('people')
export class PeopleController {
  constructor(private readonly peopleService: PeopleService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'The person has been successfully created.',
    schema: {
      example: {
        person: {
          id: '715db7f6-90e3-4210-9209-c9d299097ef7',
          name: 'Person 3',
          email: 'person3@email.com',
          sex: 'Male',
          birthDate: '16/05/1998',
          civilState: 'Married',
          admin: false,
        },
        age: 25,
        daysUntilNextBirthday: 37,
      },
    },
  })
  @ApiBody({
    schema: {
      example: {
        name: 'Person 3',
        email: 'person3@email.com',
        password: 'password',
        sex: 'Male',
        birthDate: '16/05/1998',
        civilState: 'Married',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. Check error message for details.',
    schema: {
      example: {
        message: [
          'name must be shorter than or equal to 80 characters',
          'name should not be empty',
          'name must be a string',
        ],
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Email Conflict',
    schema: {
      example: {
        message: 'This email already exists',
      },
    },
  })
  create(@Body() createPersonDto: CreatePersonDto) {
    return this.peopleService.create(createPersonDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiQuery({ name: 'page', description: 'Page Number', required: false })
  @ApiQuery({
    name: 'limit',
    description: 'Maximum number of results per page',
    required: false,
  })
  @ApiQuery({
    name: 'sex',
    description: 'Person sex',
    enum: ['Male', 'Female', 'Other'],
  })
  @ApiQuery({
    name: 'civilState',
    description: 'Civil State',
    enum: ['Married', 'Single', 'Divorced', 'Widower'],
  })
  @ApiResponse({
    status: 200,
    description: 'List of people fetched successfully.',
    schema: {
      example: {
        count: 52,
        next: 'http://localhost:3000/people/?page=11',
        previous: null,
        data: [
          {
            id: '05e7a55c-2dd4-4b31-b0ae-3999975d821d',
            name: 'Pantaleãot',
            email: 'beeeeernardeodddgdeedddvaddddlim@eemadil.com',
            sex: 'Male',
            birthDate: '16/05/1998',
            civilState: 'Married',
            admin: false,
          },
          {
            id: '0b250e10-a07a-40d3-addc-9d102a9c06fb',
            name: 'Pantaleãot',
            email: 'bernardogvalim@emadil.com',
            sex: 'Male',
            birthDate: '16/05/1998',
            civilState: 'Married',
            admin: true,
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
  @ApiBearerAuth()
  findAll(@Query() query: any, @Request() req) {
    const { page, limit } = req.query;
    if (req.user.admin == true) {
      return this.peopleService.findAll(page, limit, query);
    } else {
      throw new ForbiddenException(
        'You do not have permission to access this route',
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Person details fetched successfully.',
    schema: {
      example: {
        id: '89ffa6ee-644d-4c70-9bd8-78256ee06c8f',
        name: 'Pantaleãot',
        email: 'bernardogvalim@eemadil.com',
        sex: 'Male',
        birthDate: '16/05/1998',
        civilState: 'Married',
        admin: true,
        addresses: [
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
            id: 'c5283d3c-9a55-419b-90f7-757f58e7a251',
            zipCode: '80730330',
            address: 'Rua Corfonel Xdd',
            number: 864,
            complement: 'Apto 701',
            neighborhood: 'Bigorrilho',
            state: 'PR',
            city: 'Curitiba',
            personId: '89ffa6ee-644d-4c70-9bd8-78256ee06c8f',
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Person Not Found!',
    schema: {
      example: {
        message: 'Person Not Found!',
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
  @ApiBearerAuth()
  findOne(@Param('id') id: string, @Request() req) {
    if (req.user.admin == true || id == req.user.id) {
      return this.peopleService.findOne(id);
    } else {
      throw new ForbiddenException(
        'You do not have permission to access this route',
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/addresses')
  @ApiResponse({
    status: 200,
    description: 'Person Addresses details fetched successfully.',
    schema: {
      example: [
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
          id: 'c5283d3c-9a55-419b-90f7-757f58e7a251',
          zipCode: '80730330',
          address: 'Rua Corfonel Xdd',
          number: 864,
          complement: 'Apto 701',
          neighborhood: 'Bigorrilho',
          state: 'PR',
          city: 'Curitiba',
          personId: '89ffa6ee-644d-4c70-9bd8-78256ee06c8f',
        },
      ],
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Person Not Found!',
    schema: {
      example: {
        message: 'Person Not Found!',
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
  @ApiBearerAuth()
  async findPersonAddresses(@Param('id') id: string, @Request() req) {
    if (req.user.admin == true || id == req.user.id) {
      const person = await this.peopleService.findOne(id);
      return person.addresses;
    } else {
      throw new ForbiddenException(
        'You do not have permission to access this route',
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiBody({
    description: 'Update person details.',
    schema: {
      example: {
        name: 'Person updated',
        password: '12343436729t0',
        sex: 'Male',
        birthDate: '16/05/1998',
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Person details updated successfully.',
    schema: {
      example: {
        id: '0e723704-63a2-48ae-ab2b-9ee49d221a9b',
        name: 'Person updated',
        email: 'berddnardffo@email.com',
        sex: 'Male',
        birthDate: '16/05/1998',
        civilState: 'Divorced',
        admin: false,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Person Not Found!',
    schema: {
      example: {
        message: 'Person Not Found!',
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
        'You do not have permission to access this route',
      );
    }
  }

  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiResponse({
    status: 204,
    description: 'Person deleted successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Person Not Found!',
    schema: {
      example: {
        message: 'Person Not Found!',
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
  @ApiBearerAuth()
  remove(@Param('id') id: string, @Request() req) {
    if (req.user.admin == true || id == req.user.id) {
      return this.peopleService.remove(id);
    } else {
      throw new ForbiddenException(
        'You do not have permission to access this route',
      );
    }
  }
}
