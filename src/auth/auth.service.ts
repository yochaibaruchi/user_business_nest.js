// src/auth/auth.service.ts
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { ILoginDto, Ipayload } from './auth.interfaces';
import { refreshjwtConstants, jwtAccessConstant } from './jwt/constants';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  // return refresh token and access token.

  async getTokens(
    payload: Ipayload,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const [access_token, refresh_token] = [
      this.jwtService.sign(payload, {
        secret: jwtAccessConstant.secret,
        expiresIn: jwtAccessConstant.exp,
      }),
      this.jwtService.sign(
        { ...payload, type: 'refresh' },
        {
          secret: refreshjwtConstants.secret,
          expiresIn: refreshjwtConstants.exp,
        },
      ),
    ];

    return {
      access_token,
      refresh_token,
    };
  }

  //validate for jwt
  async validateUser(id: number): Promise<Omit<User, 'password'> | null> {
    // Find the user by email.
    console.log(id);
    
    
    const user = await this.userService.findById(id);

    // If the user is found, return the user without the password field.
    if (user) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  // validate for login.
  async validateUserInLogin({
    email,
    password,
  }: ILoginDto): Promise<Omit<User, 'password'> | null> {
    try {
      // Find the user by email.

      email = email.toLowerCase();
      const user = await this.userService.findByEmail(email);
      console.log(user);
      
      const compare = await bcrypt.compare(password, user.password);
      // If the user is found and the password matches, return the user without the password field.
      if (user && compare) {
        const { password, ...result } = user;

        return result;
      }

      // If the user is not found or the password doesn't match, return null.
      throw new UnauthorizedException();
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  async login(
    user: Omit<User, 'password'>,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const payload = { email: user.email, id: user.id };

    const tokens = await this.getTokens(payload);

    // Save the refresh token to the user object in the database
    user.refreshToken = tokens.refresh_token;
    await this.userRepository.save(user);

    return {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
    };
  }

  async logout(userId: number): Promise<void> {
    // Find the user by their ID
    console.log(userId + ' services');

    try {
      const result = await this.userRepository.update(userId, {
        refreshToken: null,
      });
      if (!result.affected) {
        throw new BadRequestException('requested user to update was not found');
      }
    } catch (error) {
      console.log(error);
      
      throw error;
    }
  }
}
