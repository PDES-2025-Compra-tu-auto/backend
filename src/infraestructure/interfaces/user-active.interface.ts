import { UserRole } from 'src/domain/user/enums/UserRole';

export interface UserActiveI {
  sub: string;
  role: UserRole;
  fullname: string;
  email: string;
  agencyId?: string;
}
