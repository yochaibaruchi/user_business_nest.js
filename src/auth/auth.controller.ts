
import { Controller, Post, UseGuards, Res , Req, Get, InternalServerErrorException} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody, ApiTags, ApiBearerAuth,ApiUnauthorizedResponse, ApiOkResponse} from '@nestjs/swagger';
import { AuthService } from './auth.service';

import { Response  } from 'express';
import { ILoginReq } from './auth.interfaces';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { JwtAuthGuard } from './guards/jwt.auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
// SWAGGER
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Authenticate user and return access token' })
  @ApiResponse({
    status: 200,
    description: 'Login successful, returning JWT and refresh tokens.',
    schema: {
      type: 'object',
      properties: {
        access_token: { type: 'string' },
        refresh_token: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Invalid email or password.',
  })
  @ApiBody({
    description: 'User login credentials',
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string', format: 'password' },
      },
      required: ['email', 'password'],
    },
  })
  // SWAGGER
  async login(@Req() req: ILoginReq, @Res({ passthrough: true }) res: Response): Promise<{ access_token: string }> {
    try {
      const tokens = await this.authService.login(req.user);
  
      // Set the refresh token as an HTTP-only cookie
      res.cookie('refreshToken', tokens.refresh_token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000
        // Add additional options like `secure: true` and `sameSite` if needed
      });
      return { access_token: tokens.access_token };
    } catch (error) {
      throw new InternalServerErrorException('An error occurred while logging in');
    }
  }



@UseGuards(RefreshTokenGuard)
  @Get('refresh')
@ApiOperation({ summary: 'Checks if the refresh token is valid and returns new tokens if true.' })
@ApiOkResponse({ description: 'Successfully generated new access token', type: String })
@ApiUnauthorizedResponse({ description: 'Invalid or expired refresh token' })
async refresh(@Req() req : ILoginReq  ,@Res({passthrough: true}) res : Response ) : Promise<{ access_token: string}> {

console.log(req.user +" controller");

  const tokens = await this.authService.login(req.user);


  // Set the refresh token as an HTTP-only cookie
  res.cookie('refreshToken', tokens.refresh_token, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000
    // Add additional options like `secure: true` and `sameSite` if needed
  });
  return {access_token : tokens.access_token}

}

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Post('logout')
@ApiOperation({ summary: 'Logout user' })
@ApiResponse({ status: 200, description: 'User logged out successfully' })
async logout(@Req() req: ILoginReq, @Res({passthrough: true}) res : Response): Promise<void> {
  // Get the user ID from the JWT payload
  const userId = req.user.id;


  // Call the logout method to remove the refresh token from the database
  await this.authService.logout(userId);

  // Instruct the client to delete the refresh token from the cookie
  res.clearCookie('refreshToken')
  res.status(200).send({ message: 'Logged out successfully' });
}

}
