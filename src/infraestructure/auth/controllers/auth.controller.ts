import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AuthGuard } from 'src/infraestructure/guards/auth.guard';
import { LoginDto } from '../dtos/login.dto';
import { RegisterDto } from '../dtos/register.dto';
import { ActiveUser } from 'src/infraestructure/decorators/active-user.decorator';
import type { UserActiveI } from 'src/infraestructure/interfaces/user-active.interface';
import { AuthService } from 'src/application/auth/services/auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ description: 'Sign In', summary: 'Sign In' })
  @Post('login')
  @HttpCode(200)
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @ApiOperation({
    description: 'Register/Create User',
    summary: 'Register/Create User',
  })
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  @ApiOperation({ description: 'Validate JWT token', summary: 'Validate JWT' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('validate')
  validate(@ActiveUser() userSession: UserActiveI) {
    const { sub, ...rest } = userSession;
    return { valid: true, id: sub, ...rest };
  }

  @ApiBody({ schema: { properties: { token: { type: 'string' } } } })
  @ApiOperation({ description: 'Refresh JWT token', summary: 'Refresh JWT' })
  @Post('refresh')
  async refresh(@Body('token') token: string) {
    return await this.authService.refreshToken(token);
  }
}
