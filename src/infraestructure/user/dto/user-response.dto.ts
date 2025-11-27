import { Expose } from 'class-transformer';
import { UserRole } from 'src/domain/user/enums/UserRole';

export class UserResponseDto {
  @Expose()
  id: string;

  @Expose()
  fullname: string;

  @Expose()
  email: string;

  @Expose()
  role: UserRole;

  @Expose()
  createdAt: Date;
}
