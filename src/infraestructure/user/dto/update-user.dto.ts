import { IsOptional } from 'class-validator';
import { UserStatus } from 'src/domain/user/enums/UserStatus';

export class UpdateUserDto {
  @IsOptional()
  fullname?: string;
  @IsOptional()
  email?: string;
  @IsOptional()
  status?: UserStatus;
}
