import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
export declare class AuthService {
    private userRepository;
    private readonly userServise;
    private readonly jwtService;
    constructor(userRepository: Repository<User>, userServise: UserService, jwtService: JwtService);
    generateRefreshToken(user: Omit<User, 'password'>): Promise<string>;
    verifyToken(token: string): Promise<any>;
    validateUser(email: string, password: string): Promise<Omit<User, 'password' | "hashPassword"> | null>;
    login(user: Omit<User, 'password'>): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
}
