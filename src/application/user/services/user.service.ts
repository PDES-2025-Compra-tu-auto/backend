import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { User } from 'src/domain/user/entities/User';
import { UserRole } from 'src/domain/user/enums/UserRole';
import { UserResponseDto } from 'src/infraestructure/user/dto/user-response.dto';
import { Repository } from 'typeorm';
import { DASHBOARD_PROFILE } from '../constants/dashboard';
import { UserDashboardDto } from 'src/infraestructure/user/dto/user-dashboard.dto';
import { UpdateUserDto } from 'src/infraestructure/user/dto/update-user.dto';
import { NotFoundException } from '@nestjs/common';

export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async me(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  async findEntityById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  userProfiling(role: UserRole): UserDashboardDto[] {
    return DASHBOARD_PROFILE[role];
  }
  async updateUser(id: string, fieldsToUpdate: UpdateUserDto) {
    await this.userRepository.update(id, fieldsToUpdate);
    return { message: 'User updated successfully' };
  }
}
