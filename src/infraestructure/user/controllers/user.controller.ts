import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ActiveUser } from 'src/infraestructure/decorators/active-user.decorator';
import type { UserActiveI } from 'src/infraestructure/interfaces/user-active.interface';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/infraestructure/guards/auth.guard';
import { UserResponseDto } from '../dto/user-response.dto';
import { UserService } from 'src/application/user/services/user.service';
import { UpdateUserDto } from '../dto/update-user.dto';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/me')
  async me(@ActiveUser() userConnected: UserActiveI): Promise<UserResponseDto> {
    return await this.userService.me(userConnected.sub);
  }

  @Get('/profile')
  dashboardByProfiling(@ActiveUser() userConnected: UserActiveI) {
    return this.userService.userProfiling(userConnected.role);
  }

  @Patch()
  async updateUser(
    @ActiveUser() { sub }: UserActiveI,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.userService.updateUser(sub, updateUserDto);
  }
}
