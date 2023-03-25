import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UserService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    findAll(): Promise<User[]>;
    findById(userId: number): Promise<User>;
    register(createUserDto: CreateUserDto): Promise<Omit<User, 'password' | 'refreshToken'>>;
    updateUser(id: number, updateUserDto: UpdateUserDto): Promise<Omit<User, 'password' | 'refreshToken'>>;
    findByEmail(email: string): Promise<User | undefined>;
}
