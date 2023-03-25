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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcrypt");
const user_entity_1 = require("../user/user.entity");
const user_service_1 = require("../user/user.service");
let AuthService = class AuthService {
    constructor(userRepository, userServise, jwtService) {
        this.userRepository = userRepository;
        this.userServise = userServise;
        this.jwtService = jwtService;
    }
    async generateRefreshToken(user) {
        const refreshTokenPayload = { sub: user.id, email: user.email, type: 'refresh' };
        const refreshToken = this.jwtService.sign(refreshTokenPayload, {
            secret: 'your-refresh-token-secret',
            expiresIn: '7d',
        });
        return refreshToken;
    }
    async verifyToken(token) {
        try {
            const decoded = await this.jwtService.verify(token);
            return decoded;
        }
        catch (err) {
            throw new common_1.UnauthorizedException('Invalid token');
        }
    }
    async validateUser(email, password) {
        email = email.toLowerCase();
        const user = await this.userServise.findByEmail(email);
        if (user && (await bcrypt.compare(password, user.password))) {
            const { password } = user, result = __rest(user, ["password"]);
            return result;
        }
        return null;
    }
    async login(user) {
        const payload = { email: user.email, sub: user.id };
        const refreshToken = await this.generateRefreshToken(user);
        user.refreshToken = refreshToken;
        await this.userRepository.save(user);
        return {
            access_token: this.jwtService.sign(payload),
            refresh_token: refreshToken,
        };
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        user_service_1.UserService,
        jwt_1.JwtService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map