import { Expose } from 'class-transformer';
import { UserRole } from 'src/domain/user/enums/UserRole';

export class RegisterResponseDto {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  role: UserRole;

  @Expose()
  createdAt: Date;
}
