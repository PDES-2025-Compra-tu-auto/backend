import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { RegisterDto } from 'src/infraestructure/auth/dtos/register.dto';
import { RegisterResponseDto } from 'src/infraestructure/auth/dtos/register-response.dto';
import { Repository } from 'typeorm';
import { User } from 'src/domain/user/entities/User';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginDto } from 'src/infraestructure/auth/dtos/login.dto';
import { UserStatus } from 'src/domain/user/enums/UserStatus';
import { MetricsService } from 'src/metrics/metrics.service';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly metricsService: MetricsService,
  ) {}

  async refreshToken(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token);

      const newAccessToken = this.jwtService.sign(
        { sub: payload.sub, role: payload.role },
        { expiresIn: '1h' },
      );

      const { exp } = this.jwtService.decode(newAccessToken);

      return {
        accessToken: newAccessToken,
        expiresAt: exp,
      };
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async login({ email, password }: LoginDto) {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.status === UserStatus.INACTIVE) {
      throw new UnauthorizedException('User is inactive');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      role: user.role,
      fullname: user.fullname,
      email: user.email,
    };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '6h' });
    const { exp } = this.jwtService.decode(accessToken);

    return {
      id: user.id,
      accessToken: accessToken,
      expiresAt: exp,
      email: user.email,
      refreshToken: refreshToken,
      fullname: user.fullname,
      role: user.role,
    };
  }

  async register(dto: RegisterDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 12);

    const user = this.userRepository.create({
      ...dto,
      password: hashedPassword,
    });

    await this.userRepository.save(user);

    this.metricsService.usersRegistered.inc({ role: dto.role });

    const userCreated = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    const userResponse = plainToInstance(RegisterResponseDto, userCreated, {
      excludeExtraneousValues: true,
    });
    return userResponse;
  }
}
