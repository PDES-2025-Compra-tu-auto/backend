import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/application/auth/services/auth.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ description: 'Sign In', summary: 'Sign In' })
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @ApiOperation({
    description: 'Register/Create User',
    summary: 'Register/Create User',
  })
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @ApiOperation({ description: 'Validate JWT token', summary: 'Validate JWT' })
  @Post('validate')
  validate(@Body('token') token: string) {
    return this.authService.validateToken(token);
  }

  @Post('refresh')
  async refresh(@Body('token') token: string) {
    return this.authService.refreshToken(token);
  }
}
