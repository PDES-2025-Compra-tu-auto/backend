import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from 'src/application/auth/services/auth.service';
import { AuthController } from 'src/infraestructure/controllers/auth/auth.controller';
import { UserRepositoryModule } from '../user/user.module';

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
    UserRepositoryModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
