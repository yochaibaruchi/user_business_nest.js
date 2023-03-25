"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./user.entity");
const common_2 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
let UserService = class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async findAll() {
        try {
            return await this.userRepository.find();
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to fetch all users.');
        }
    }
    async findById(userId) {
        try {
            const user = await this.userRepository.findOneBy({ id: userId });
            if (!user) {
                throw new common_1.NotFoundException(`User with id ${userId} not found.`);
            }
            return user;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            else {
                throw new common_1.InternalServerErrorException('Failed to fetch user by id.');
            }
        }
    }
    async register(createUserDto) {
        const validationErrors = await (0, class_validator_1.validate)(createUserDto);
        if (!validationErrors) {
            throw new common_1.BadRequestException(validationErrors.map((error) => Object.values(error.constraints)).flat().join(', '));
        }
        const user = new user_entity_1.User();
        user.firstName = createUserDto.firstName;
        user.lastName = createUserDto.lastName;
        user.email = createUserDto.email;
        user.password = createUserDto.password;
        user.phone = createUserDto.phone;
        user.isAdmin = createUserDto.isAdmin;
        try {
            const newUser = await this.userRepository.save(user);
            const { password, refreshToken } = newUser, userWithoutPassword = __rest(newUser, ["password", "refreshToken"]);
            return userWithoutPassword;
        }
        catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new common_2.ConflictException('User with this email already exists.');
            }
            throw error;
        }
    }
    async updateUser(id, updateUserDto) {
        var _a, _b, _c, _d, _e;
        const validationErrors = await (0, class_validator_1.validate)(updateUserDto);
        if (!validationErrors) {
            throw new common_1.BadRequestException(validationErrors.map((error) => Object.values(error.constraints)).flat().join(', '));
        }
        const user = await this.findById(id);
        if (!user) {
            throw new common_1.NotFoundException(`User with id ${id} not found.`);
        }
        user.firstName = (_a = updateUserDto.firstName) !== null && _a !== void 0 ? _a : user.firstName;
        user.lastName = (_b = updateUserDto.lastName) !== null && _b !== void 0 ? _b : user.lastName;
        user.email = (_c = updateUserDto.email) !== null && _c !== void 0 ? _c : user.email;
        user.phone = (_d = updateUserDto.phone) !== null && _d !== void 0 ? _d : user.phone;
        user.isAdmin = (_e = updateUserDto.isAdmin) !== null && _e !== void 0 ? _e : user.isAdmin;
        try {
            const updatedUser = await this.userRepository.save(user);
            const { password, refreshToken } = updatedUser, userWithoutPassword = __rest(updatedUser, ["password", "refreshToken"]);
            return userWithoutPassword;
        }
        catch (error) {
            console.log(error);
            if (error.code === 'ER_DUP_ENTRY') {
                throw new common_2.ConflictException('User with this email already exists.');
            }
            else {
                throw new common_1.InternalServerErrorException('Failed to update user.');
            }
        }
    }
    async findByEmail(email) {
        return this.userRepository.findOne({ where: { email } });
    }
};
UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map