import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import {refreshjwtConstants} from './constants'
import { User } from 'src/user/user.entity';
import { Request } from 'express';
import { Ipayload } from '../auth.interfaces';
@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'refresh-token') {
  constructor(
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          console.log(req.cookies['refreshToken']);
          
        return  req.cookies['refreshToken']
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: refreshjwtConstants.secret , 
      passReqToCallback: true, 
    });
  }

  async validate( req : Request , payload: Ipayload): Promise< Omit<User, "password">> {
   


    const refreshToken = req.cookies['refreshToken'];
    
    const user = await this.authService.validateUser(payload.id);
   
    
    
    if (!user || user.refreshToken !== refreshToken) {
      throw new BadRequestException();
    }

    return user;
  }
}