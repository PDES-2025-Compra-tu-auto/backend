import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from 'src/infraestructure/controllers/auth/dtos/register.dto';
import { UserRepositoryFactory } from 'src/infraestructure/factories/user-repository.factory';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from 'src/infraestructure/controllers/auth/dtos/register-response.dto';
import { LoginDto } from 'src/infraestructure/controllers/auth/dtos/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepositoryFactory: UserRepositoryFactory,
    private readonly jwtService: JwtService,
  ) {}

  async login({ email, password, role }: LoginDto) {
    const repo = this.userRepositoryFactory.getRepository(role);
    const user = await repo.findOne({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(dto: RegisterDto) {
    const repo = this.userRepositoryFactory.getRepository(dto.role);
    const existingUser = await repo.findOne({ where: { email: dto.email } });
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 12);

    const user = repo.create({
      ...dto,
      password: hashedPassword,
    });

    await repo.save(user);

    const userCreated = await repo.findOne({ where: { email: dto.email } });
    const userResponse = plainToInstance(UserResponseDto, userCreated, {
      excludeExtraneousValues: true,
    });
    return userResponse;
  }
}
