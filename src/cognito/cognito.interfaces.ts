import { Request } from 'express';
import { TokenPayload } from 'google-auth-library';

export interface CognitoJwt extends Request {
  user: JWTPayload;
}

export interface GoogleIdTokenPayload extends Request {
  user: TokenPayload;
}

export interface JWTPayload {
  sub: string;
  iss: string;
  client_id: string;
  origin_jti: string;
  event_id: string;
  token_use: string;
  scope: string;
  auth_time: number;
  exp: number;
  iat: number;
  jti: string;
  username: string;
}

export interface CognitoIdToken {
  sub: string;
  email_verified: boolean;
  iss: string;
  'cognito:username': string;
  origin_jti: string;
  aud: string;
  event_id: string;
  token_use: string;
  auth_time: number;
  name: string;
  exp: number;
  iat: number;
  jti: string;
  email: string;
  [key: string]: unknown;
}
