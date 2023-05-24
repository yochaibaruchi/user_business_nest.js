import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { CognitoService } from './cognito.service';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ConfirmSignupDto } from './dto/ConfirmSignUp.dto';
import {
  AdminRespondToAuthChallengeCommandOutput,
  GlobalSignOutCommandOutput,
  InitiateAuthCommandOutput,
} from '@aws-sdk/client-cognito-identity-provider';
import { InitiateAuthDto } from './dto/initiateAuth.dto';
import { AuthResetPasswordConfirmDto } from './dto/AuthResetPasswordConfirm.dto';
import { AuthResetPasswordRequestDto } from './dto/AuthResetPasswordReq.dto';
import { NewPasswordRequiredDto } from './dto/newPasswordRequired.dto';
import { RefreshTokenDto } from './dto/refreshReq.dto';
import { GlobalSignOutDto } from './dto/globalSignOut.dto';

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
  @Post('confirm-signup')
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
    return this.cognitoService.resendConfirmationCode(email);
  }

  @Post('signin')
  @ApiOperation({ summary: 'Sign in' })
  @ApiResponse({
    status: 200,
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
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiResponse({ status: 503, description: 'Service Unavailable.' })
  async logoutUser(
    @Body() accessToken: GlobalSignOutDto,
  ): Promise<GlobalSignOutCommandOutput> {
    return this.cognitoService.logoutUser(accessToken);
  }
}
