import { UserService } from './user.service';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    findAll(): Promise<User[]>;
    findOne(id: number): Promise<User>;
    create(createUserDto: CreateUserDto): Promise<Omit<User, 'password' | 'refreshToken'>>;
    updateUser(id: number, updateUserDto: UpdateUserDto): Promise<Omit<User, 'password' | 'refreshToken'>>;
}
