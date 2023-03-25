
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { jwtConstants } from './constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(authService : AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

//   async validate(payload: any) {
//     const user =  authService.validateUser(payload.email, payload.password);
//     if (!user) {
//       throw new UnauthorizedException();
//     }

//     return {
//       userId: user.id,
//       email: user.email,
//       refreshToken: user.refreshToken,
//     };
// }
}
