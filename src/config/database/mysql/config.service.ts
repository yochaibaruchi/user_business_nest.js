import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MysqlConfigService {
  constructor(private readonly configService: ConfigService) {}

  get host(): string {
    return this.configService.get<string>('MYSQL_HOST');
  }

  get port(): number {
    return +this.configService.get<number>('MYSQL_PORT');
  }

  get username(): string {
    return this.configService.get<string>('MYSQL_USER_NAME');
  }

  get password(): string {
    return this.configService.get<string>('MYSQL_ROOT_PASSWORD');
  }

  get database(): string {
    return this.configService.get<string>('MYSQL_DATABASE');
  }
}