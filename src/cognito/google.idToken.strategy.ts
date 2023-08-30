import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { OAuth2Client, TokenPayload } from 'google-auth-library';

@Injectable()
export class GoogleTokenStrategy extends PassportStrategy(
  Strategy,
  'google-token',
) {
  private googleClient: OAuth2Client;

  constructor() {
    super();
    this.googleClient = new OAuth2Client({
      clientId: process.env.GOOGLE_CLIENT_ID_BACK,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    });
  }

  async validate(req: any, done: Function) {
    const idToken = req.body.idToken;
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken: idToken,
        audience: process.env.GOOGLE_CLIENT_ID_FRONT,
      });
      const payload: TokenPayload = ticket.getPayload();

      done(null, payload);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        done(new Error('Google ID token has expired'));
      } else if (error.name === 'JsonWebTokenError') {
        done(new Error('Invalid Google ID token'));
      } else {
        done(error);
      }
    }
  }
}
