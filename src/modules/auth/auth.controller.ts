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
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InBlcnNvbjJAZW1haWwuY29tIiwiYWRtaW4iOnRydWUsImlhdCI6MTcxMjcwNTc5Mywic3ViIjoiZWUyNzhmZWEtM2Q4Yy00NzcwLWJiZGQtYWViNmUxMzIzNWY4In0.nAiDsKe4LNYuKkEaWyrBZoGbSECXLRc_M7QFZd1Q9bY',
      },
    },
  })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
