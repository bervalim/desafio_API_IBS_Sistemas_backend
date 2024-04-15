import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('login')
@Controller('login')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @ApiBody({
    description: 'Login credentials.',
    schema: {
      example: {
        email: 'person2@email.com',
        password: '12345678',
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful.',
    schema: {
      example: {
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InBlcnNvbmY0ZmZmQGVtYWlsLmNvbSIsImFkbWluIjp0cnVlLCJpYXQiOjE3MTMxOTg4NTQsInN1YiI6Ijg0ZTBmYmViLTFjMDktNDA1Yi05M2I2LWU1YzAzYzMwMTNkYiJ9.mglyChq-wmjYkKXiRr2i2m9aGu04IlY5wNoxBF2V4kc',
        person: {
          civilState: 'Married',
          birthDate: '16/05/1998',
          sex: 'Male',
          name: 'person',
          email: 'personf4fff@email.com',
          id: '84e0fbeb-1c09-405b-93b6-e5c03c3013db',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid Email/Password',
    schema: {
      example: {
        message: 'Invalid email or password',
      },
    },
  })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
