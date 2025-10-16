import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserStatus } from '../../../src/domain/user/enums/UserStatus';
import { AuthService } from '../../../src/application/auth/services/auth.service';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;

  let userRepository: {
    findOne: jest.Mock;
    create: jest.Mock;
    save: jest.Mock;
  };

  let jwtService: {
    verifyAsync: jest.Mock;
    sign: jest.Mock;
    decode: jest.Mock;
  };

  beforeEach(async () => {
    userRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    jwtService = {
      verifyAsync: jest.fn(),
      sign: jest.fn(),
      decode: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: 'UserRepository', useValue: userRepository },
        { provide: JwtService, useValue: jwtService },
      ],
    })
      .overrideProvider('UserRepository')
      .useValue(userRepository)
      .compile();

    service = module.get<AuthService>(AuthService);
    (service as any).userRepository = userRepository;
    (service as any).jwtService = jwtService;

    jest.clearAllMocks(); 
  });

  describe('refreshToken', () => {
    it('should refresh token correctly', async () => {
      const token = 'token';
      const payload = { sub: 1, role: 'user' };
      jwtService.verifyAsync.mockResolvedValue(payload);
      jwtService.sign.mockReturnValue('newAccessToken');
      jwtService.decode.mockReturnValue({ exp: 123456 });

      const result = await service.refreshToken(token);

      expect(jwtService.verifyAsync).toHaveBeenCalledWith(token);
      expect(jwtService.sign).toHaveBeenCalledWith(
        { sub: payload.sub, role: payload.role },
        { expiresIn: '1h' },
      );
      expect(jwtService.decode).toHaveBeenCalledWith('newAccessToken');
      expect(result).toEqual({
        accessToken: 'newAccessToken',
        expiresAt: 123456,
      });
    });

    it('should throw UnauthorizedException on invalid token', async () => {
      jwtService.verifyAsync.mockRejectedValue(new Error('Invalid'));

      await expect(service.refreshToken('badtoken')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('login', () => {
    const loginDto = { email: 'test@example.com', password: 'pass' };
    const user = {
      id: 1,
      email: loginDto.email,
      password: 'hashedpass',
      status: UserStatus.ACTIVE,
      role: 'user',
      fullname: 'Test User',
    };

    it('should throw NotFoundException if user not found', async () => {
      userRepository.findOne.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw UnauthorizedException if user is inactive', async () => {
      userRepository.findOne.mockResolvedValue({
        ...user,
        status: UserStatus.INACTIVE,
      });

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      userRepository.findOne.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should return tokens on valid login', async () => {
      userRepository.findOne.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);  

      jwtService.sign.mockReturnValueOnce('accessToken');
      jwtService.sign.mockReturnValueOnce('refreshToken');
      jwtService.decode.mockReturnValue({ exp: 123456 });

      const result = await service.login(loginDto);

      expect(result).toEqual({
        id: user.id,
        accessToken: 'accessToken',
        expiresAt: 123456,
        email: user.email,
        refreshToken: 'refreshToken',
        fullname: user.fullname,
        role: user.role,
      });
    });
  });

  describe('register', () => {
    const dto = {
      email: 'new@example.com',
      password: 'pass',
      fullname: 'New User',
    };
    const userCreated = { id: 1, email: dto.email, fullname: dto.fullname };

    it('should throw BadRequestException if user already exists', async () => {
      userRepository.findOne.mockResolvedValue(userCreated);

      await expect(service.register(dto as any)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should create and return user on successful register', async () => {
      userRepository.findOne.mockResolvedValueOnce(null);
      (bcrypt.hash as jest.Mock).mockResolvedValueOnce('hashedpass');
      userRepository.create.mockReturnValue({ ...dto, password: 'hashedpass' });
      userRepository.save.mockResolvedValue(null);
      userRepository.findOne.mockResolvedValueOnce(userCreated);

      const result = await service.register(dto as any);

      expect(userRepository.create).toHaveBeenCalledWith({
        ...dto,
        password: 'hashedpass',
      });
      expect(userRepository.save).toHaveBeenCalled();

      expect(result).toMatchObject({
        email: dto.email,
      });
    });
  });
});
