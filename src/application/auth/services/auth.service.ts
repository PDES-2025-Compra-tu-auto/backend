import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { RegisterDto } from 'src/infraestructure/auth/dtos/register.dto';
import { UserResponseDto } from 'src/infraestructure/auth/dtos/register-response.dto';
import { Repository } from 'typeorm';
import { User } from 'src/domain/user/entities/User';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginDto } from 'src/infraestructure/auth/dtos/login.dto';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async refreshToken(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        ignoreExpiration: true,
      });

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

  async login({email,password}:LoginDto) {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, role: user.role, fullname: user.fullname, email: user.email };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '6h' });
    const { exp } = this.jwtService.decode(accessToken);

    return {
      accessToken: accessToken,
      expiresAt: exp,
      refreshToken: refreshToken,
      fullName: user.fullname,
      role: user.role,
    };
  }

  async register(dto: RegisterDto) {
    const existingUser = await this.userRepository.findOne({ where: { email: dto.email } });
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 12);

    const user = this.userRepository.create({
      ...dto,
      password: hashedPassword,
    });

    await this.userRepository.save(user);

    const userCreated = await this.userRepository.findOne({ where: { email: dto.email } });
    const userResponse = plainToInstance(UserResponseDto, userCreated, {
      excludeExtraneousValues: true,
    });
    return userResponse;
  }
}
