// test/auth.controller.integration.spec.ts
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from 'src/application/auth/services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from 'src/infraestructure/auth/controllers/auth.controller';
import { User } from 'src/domain/user/entities/User';
import { UserRole } from 'src/domain/user/enums/UserRole';

describe('AuthController Integration', () => {
  let authController: AuthController;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5433,
          username: 'nestuser',
          password: 'nestpassword',
          database: 'nestdb',
          autoLoadEntities: true,
          synchronize: true,
          dropSchema: true,
        }),
        TypeOrmModule.forFeature([User]),
        JwtModule.register({
          secret: 'test-secret',
          signOptions: { expiresIn: '60s' },
        }),
      ],
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    authController = moduleRef.get(AuthController);
  });

  it('should register a new user', async () => {
    const result = await authController.register({
      fullname: 'Ana',
      email: 'ana@test.com',
      password: '123456',
      role: UserRole.BUYER,
    });

    expect(result).toMatchObject({
      email: 'ana@test.com',
      role: 'BUYER',
    });
  });

  it('should login a user', async () => {
    const result = await authController.login({
      email: 'ana@test.com',
      password: '123456',
    });

    expect(result).toHaveProperty('accessToken');
    expect(result).toHaveProperty('refreshToken');
  });

  it('should refresh a token', async () => {
    const loginResult = await authController.login({
      email: 'ana@test.com',
      password: '123456',
    });

    const result = await authController.refresh(loginResult.refreshToken);
    expect(result).toHaveProperty('accessToken');
  });
});
