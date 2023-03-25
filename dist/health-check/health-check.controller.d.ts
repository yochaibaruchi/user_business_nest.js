import { HealthCheckService, TypeOrmHealthIndicator } from '@nestjs/terminus';
export declare class HealthCheckController {
    private healthCheckService;
    private db;
    constructor(healthCheckService: HealthCheckService, db: TypeOrmHealthIndicator);
    check(): Promise<import("@nestjs/terminus").HealthCheckResult>;
}
