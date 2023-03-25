"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MysqlDatabaseProviderModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_module_1 = require("../../../config/database/mysql/config.module");
const config_service_1 = require("../../../config/database/mysql/config.service");
const user_entity_1 = require("../../../user/user.entity");
let MysqlDatabaseProviderModule = class MysqlDatabaseProviderModule {
};
MysqlDatabaseProviderModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_module_1.MysqlConfigModule],
                useFactory: async (mysqlConfigService) => ({
                    type: 'mysql',
                    host: mysqlConfigService.host,
                    port: mysqlConfigService.port,
                    username: mysqlConfigService.username,
                    password: mysqlConfigService.password,
                    database: mysqlConfigService.database,
                    synchronize: true,
                    entities: [
                        user_entity_1.User,
                    ],
                }),
                inject: [config_service_1.MysqlConfigService],
            }),
        ],
    })
], MysqlDatabaseProviderModule);
exports.MysqlDatabaseProviderModule = MysqlDatabaseProviderModule;
//# sourceMappingURL=provider.module.js.map