import { Body, Controller, Post, Headers, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/application/auth/services/auth.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { AuthGuard } from 'src/infraestructure/guards/auth.guard';

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
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post('validate')
  async validate() {
    return {valid:true}
  }

  @ApiBody({ schema: { properties: { token: { type: 'string' } } } })
  @ApiOperation({ description: 'Refresh JWT token', summary: 'Refresh JWT' })
  @Post('refresh')
  async refresh(@Body('token') token: string) {
    return this.authService.refreshToken(token);
  }
}
