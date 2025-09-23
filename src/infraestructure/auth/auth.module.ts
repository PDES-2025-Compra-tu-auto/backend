import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from 'src/application/auth/services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { UserModule } from '../user/user.module';
import { LoginUseCase } from 'src/application/auth/use-cases/login.use-case';
import { RegisterUseCase } from 'src/application/auth/use-cases/register.use-case';
import { ValidateUseCase } from 'src/application/auth/use-cases/validate.use-case';
import { RefreshTokenUseCase } from 'src/application/auth/use-cases/refreshToken.useCase';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [LoginUseCase, RegisterUseCase,ValidateUseCase,RefreshTokenUseCase, AuthService],
})
export class AuthModule {}
