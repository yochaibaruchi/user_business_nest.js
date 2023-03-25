// src/auth/auth.service.ts
import { Injectable, UnauthorizedException  } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'; 
import { User } from '../user/user.entity'
import {UserService} from '../user/user.service'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly userServise : UserService,
    private readonly jwtService : JwtService
  ) {}
   
    
  async generateRefreshToken(user: Omit<User, 'password'>): Promise<string> {
    const refreshTokenPayload = { sub: user.id, email: user.email, type: 'refresh' };
    const refreshToken = this.jwtService.sign(refreshTokenPayload, {
      secret: 'your-refresh-token-secret', // Replace this with a secure secret for refresh tokens
      expiresIn: '7d', // Set the expiration time for refresh tokens (e.g., 7 days)
    });
  
    return refreshToken;
  }


  
//VERIFY TOKEN
  async verifyToken(token: string): Promise<any> {
    try {
      const decoded = await this.jwtService.verify(token);
      return decoded;
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
  

  // Other service methods...
  async validateUser(email: string, password: string):  Promise<Omit<User, 'password' | "hashPassword" > | null> {

    // Find the user by email.
    email = email.toLowerCase();
    const user = await this.userServise.findByEmail(email);
    
    // If the user is found and the password matches, return the user without the password field.
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }

    // If the user is not found or the password doesn't match, return null.
    return null;
  }

  async login(user: Omit<User, 'password'>): Promise<{ access_token: string, refresh_token: string }> {
    const payload = { email: user.email, sub: user.id };
    const refreshToken = await this.generateRefreshToken(user);
  
    // Save the refresh token to the user object in the database
    user.refreshToken = refreshToken;
    await this.userRepository.save(user);
  
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: refreshToken,
    };
  }


}
