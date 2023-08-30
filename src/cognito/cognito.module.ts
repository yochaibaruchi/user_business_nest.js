import { Module, forwardRef } from '@nestjs/common';
import { CognitoController } from './cognito.controller';
import { CognitoService } from './cognito.service';
import { PassportModule } from '@nestjs/passport';
import { CognitoJwtStrategy } from './cognito.strategy';
import { UserModule } from 'src/user/user.module';
import { UserBusinessRoleModule } from 'src/userBusinessRole/user-business-role.module';
import { RolesGuard } from './guards/roleGuard.guard';
import { CognitoAuthGuard } from './guards/cognito.jwt.guard';
import { GoogleTokenStrategy } from './google.idToken.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    forwardRef(() => UserModule),
    UserBusinessRoleModule,
  ],
  controllers: [CognitoController],
  providers: [
    CognitoService,
    CognitoJwtStrategy,
    RolesGuard,
    CognitoAuthGuard,
    GoogleTokenStrategy,
  ],
  exports: [CognitoService, RolesGuard, CognitoAuthGuard],
})
export class CognitoModule {}
