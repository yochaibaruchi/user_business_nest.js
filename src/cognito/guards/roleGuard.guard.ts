import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { UserBusinessRoleService } from 'src/userBusinessRole/user-business-role.service';
import { IsAdminDto } from 'src/userBusinessRole/dto/isUserBusinessAdmin.dto';

@Injectable()
export class RolesGuard extends AuthGuard('cognitoJWT') {
  constructor(private userBusinessRoleService: UserBusinessRoleService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context); // This line performs the initial authentication

    const request = context.switchToHttp().getRequest();

    const isAdminDto: IsAdminDto = {
      userId: request.user.sub, // Assuming the user's ID is in the "sub" field of the JWT payload
      businessId: request.params.id,
    };

    const userIsAdmin: boolean =
      await this.userBusinessRoleService.isAdminUserForBusiness(isAdminDto);
    console.log(userIsAdmin);

    return userIsAdmin;
  }
}
