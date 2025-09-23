import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AuthGuard } from 'src/infraestructure/guards/auth.guard';
import { LoginDto } from '../dtos/login.dto';
import { RegisterDto } from '../dtos/register.dto';
import { LoginUseCase } from 'src/application/auth/use-cases/login.use-case';
import { ValidateUseCase } from 'src/application/auth/use-cases/validate.use-case';
import { RegisterUseCase } from 'src/application/auth/use-cases/register.use-case';
import { RefreshTokenUseCase } from 'src/application/auth/use-cases/refreshToken.useCase';
import { ActiveUser } from 'src/infraestructure/decorators/active-user.decorator';
import type { UserActiveI } from 'src/infraestructure/interfaces/user-active.interface';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase,
    private readonly validateUseCase: ValidateUseCase,
    private readonly refreshUseCase: RefreshTokenUseCase,
    private readonly registerUseCase: RegisterUseCase,
  ) {}

  @ApiOperation({ description: 'Sign In', summary: 'Sign In' })
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.loginUseCase.execute(loginDto);
  }

  @ApiOperation({
    description: 'Register/Create User',
    summary: 'Register/Create User',
  })
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return await this.registerUseCase.execute(registerDto);
  }

  @ApiOperation({ description: 'Validate JWT token', summary: 'Validate JWT' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('validate')
  async validate(@ActiveUser() userSession:UserActiveI) {
    return await this.validateUseCase.execute(userSession);
  }

  @ApiBody({ schema: { properties: { token: { type: 'string' } } } })
  @ApiOperation({ description: 'Refresh JWT token', summary: 'Refresh JWT' })
  @Post('refresh')
  async refresh(@Body('token') token: string) {
    return await this.refreshUseCase.execute(token);
  }
}
