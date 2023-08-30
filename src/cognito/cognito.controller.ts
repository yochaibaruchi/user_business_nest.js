import {
  Controller,
  Post,
  Body,
  HttpCode,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CognitoService } from './cognito.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ConfirmSignupDto } from './dto/ConfirmSignUp.dto';
import {
  AdminInitiateAuthCommandOutput,
  AdminRespondToAuthChallengeCommandOutput,
  GlobalSignOutCommandOutput,
  InitiateAuthCommandOutput,
} from '@aws-sdk/client-cognito-identity-provider';
import { InitiateAuthDto } from './dto/InitiateAuth.dto';
import { AuthResetPasswordConfirmDto } from './dto/AuthResetPasswordConfirm.dto';
import { AuthResetPasswordRequestDto } from './dto/AuthResetPasswordReq.dto';
import { NewPasswordRequiredDto } from './dto/newPasswordRequired.dto';
import { RefreshTokenDto } from './dto/refreshReq.dto';
import { GlobalSignOutDto } from './dto/globalSignOut.dto';
import { GoogleTokenGuard } from './guards/google.idToken.guard';
import { GoogleIdTokenPayload } from './cognito.interfaces';
import {
  AdminAuthRegisterUserDto,
  GoogleIdTokenDto,
} from './dto/AuthRegisterUser.dto';
import { SignInResponseDto } from './dto/FirstSignIn.dto';
@ApiTags(
  'cognito - cognito gets the access token in the body when needed, no need for guard.',
)
@Controller('cognito')
export class CognitoController {
  constructor(private readonly cognitoService: CognitoService) {}

  @Post('confirm-signup')
  @ApiOperation({ summary: 'Confirm user email' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['email', 'confirmationCode'],
      properties: {
        email: { type: 'string', example: 'johndoe@example.com' },
        confirmationCode: { type: 'string', example: '123456' },
      },
    },
  })
  @ApiOkResponse({ description: 'Email confirmation successful' })
  async confirmSignUp(
    @Body() confirmSignUpDto: ConfirmSignupDto,
  ): Promise<any> {
    try {
      await this.cognitoService.confirmSignUp(confirmSignUpDto);
      return { message: 'Email confirmation successful' };
    } catch (error) {
      console.log('Error confirming email:', error);
      throw error;
    }
  }

  @Post('resend-confirmation-code')
  @HttpCode(204)
  @ApiOperation({ summary: 'Resend the confirmation code' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['email'],
      properties: {
        email: {
          type: 'string',
          example: 'johndoe@example.com',
        },
      },
    },
  })
  async resendConfirmationCode(@Body('email') email: string): Promise<void> {
    await this.cognitoService.resendConfirmationCode(email);
  }

  @Post('signin')
  @ApiOperation({ summary: 'Sign in' })
  @ApiResponse({
    status: 201,
    description: 'User successfully signed in, returns authentication data.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async signIn(
    @Body() authLoginDto: InitiateAuthDto,
  ): Promise<InitiateAuthCommandOutput> {
    return this.cognitoService.signIn(authLoginDto);
  }

  @Post('request-password-reset')
  @HttpCode(204)
  @ApiOperation({ summary: 'Request a password reset' })
  @ApiResponse({
    status: 204,
    description: 'Password reset request sent successfully',
  })
  @ApiBody({ type: AuthResetPasswordRequestDto })
  async requestPasswordReset(
    @Body() authResetPasswordRequestDto: AuthResetPasswordRequestDto,
  ): Promise<void> {
    await this.cognitoService.requestPasswordReset(authResetPasswordRequestDto);
  }

  @Post('confirm-password-reset')
  @HttpCode(204)
  @ApiOperation({ summary: 'Confirm password reset' })
  @ApiResponse({
    status: 204,
    description: 'Password reset confirmed successfully',
  })
  @ApiBody({ type: AuthResetPasswordConfirmDto })
  async confirmPasswordReset(
    @Body() authResetPasswordConfirmDto: AuthResetPasswordConfirmDto,
  ): Promise<void> {
    await this.cognitoService.confirmPasswordReset(authResetPasswordConfirmDto);
  }

  @Post('handle-new-password-required')
  @ApiOperation({
    summary:
      'Handle new password required, only if a user gets a password from admin.',
  })
  @ApiBody({ type: NewPasswordRequiredDto })
  @ApiResponse({
    status: 200,
    description: 'New password has been set successfully.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async handleNewPasswordRequired(
    @Body() newPasswordRequiredDto: NewPasswordRequiredDto,
  ): Promise<AdminRespondToAuthChallengeCommandOutput> {
    return this.cognitoService.handleNewPasswordChallenge(
      newPasswordRequiredDto,
    );
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Handle refresh tokens' })
  @ApiBody({ type: RefreshTokenDto })
  async refreshTokenHandler(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<InitiateAuthCommandOutput> {
    return this.cognitoService.refreshTokens(refreshTokenDto);
  }

  @Post('GlobalLogout')
  @ApiOperation({ summary: 'Log out a user' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['accessToken'],
      properties: {
        accessToken: {
          type: 'string',
          example: '7f65f30c-659e-4....',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'User has been logged out successfully.',
  })
  @HttpCode(200)
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async logoutUser(
    @Body() accessToken: GlobalSignOutDto,
  ): Promise<GlobalSignOutCommandOutput> {
    return this.cognitoService.logoutUser(accessToken);
  }

  @ApiBearerAuth()
  @UseGuards(GoogleTokenGuard)
  @Post('sign-in-with-google')
  @ApiOperation({
    summary: 'Create a user with Google ID token',
    description:
      'This endpoint allows you to create a user using Google ID token. It also authenticates the user server-side and returns a Cognito session.',
  })
  @ApiBody({ type: GoogleIdTokenDto })
  @ApiCreatedResponse({
    description: 'The user has been successfully created and authenticated.',
  })
  @ApiBadRequestResponse({
    description: 'Bad Request. Invalid parameters.',
  })
  @ApiUnauthorizedResponse({
    description:
      'Unauthorized. Invalid Google ID token or Cognito credentials.',
  })
  async createUserWithGoogleToken(
    @Body() googleIdTokenDto: GoogleIdTokenDto,
    @Req() req: GoogleIdTokenPayload,
  ): Promise<AdminInitiateAuthCommandOutput> {
    const signUpParams: AdminAuthRegisterUserDto = {
      name: req.user.name,
      email: req.user.email,
      password: req.user.sub,
      emailVerified: req.user.email_verified,
    };

    return await this.cognitoService.adminSignUpForgoogle(signUpParams);
  }

  @Post('first_signin')
  @ApiOperation({ summary: 'first Sign in' })
  @ApiResponse({
    status: 201,
    description:
      'User successfully signed in, returns authentication data not include access token.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async firstSignIn(
    @Body() authLoginDto: InitiateAuthDto,
  ): Promise<SignInResponseDto> {
    const authResult = await this.cognitoService.signIn(authLoginDto);
    return {
      refreshToken: authResult.AuthenticationResult.RefreshToken,
      idToken: authResult.AuthenticationResult.IdToken,
    };
  }
}
