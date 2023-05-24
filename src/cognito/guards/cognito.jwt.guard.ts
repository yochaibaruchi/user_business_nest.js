//doto
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class CognitoAuthGuard extends AuthGuard('cognitoJWT') {}
//  DOTO: using the guard in all routs that need it.
