import { ConfigService } from '@nestjs/config';
export declare class MysqlConfigService {
    private readonly configService;
    constructor(configService: ConfigService);
    get host(): string;
    get port(): number;
    get username(): string;
    get password(): string;
    get database(): string;
}
