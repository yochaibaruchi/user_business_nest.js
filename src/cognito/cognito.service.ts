import CognitoErrors from './cognito.constants';
import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
  ConflictException,
  forwardRef,
} from '@nestjs/common';
import {
  AdminCreateUserCommandInput,
  AdminCreateUserCommandOutput,
  AdminRespondToAuthChallengeCommand,
  AdminRespondToAuthChallengeCommandInput,
  AdminRespondToAuthChallengeCommandOutput,
  AdminSetUserPasswordCommandInput,
  AdminUpdateUserAttributesCommand,
  AdminUpdateUserAttributesCommandInput,
  AdminUserGlobalSignOutCommandInput,
  AdminUserGlobalSignOutCommandOutput,
  CognitoIdentityProvider,
  ConfirmForgotPasswordCommand,
  ConfirmForgotPasswordCommandInput,
  ForgotPasswordCommand,
  ForgotPasswordCommandInput,
  GlobalSignOutCommandInput,
  GlobalSignOutCommandOutput,
  InitiateAuthCommandInput,
  InitiateAuthCommandOutput,
  InvalidEmailRoleAccessPolicyException,
  ResendConfirmationCodeCommand,
  ResendConfirmationCodeCommandInput,
  SignUpCommandInput,
  SignUpCommandOutput,
  UserNotFoundException,
} from '@aws-sdk/client-cognito-identity-provider';
import { createHash, createHmac } from 'crypto';
import {
  AdminAuthRegisterUserDto,
  AuthRegisterUserDto,
} from './dto/AuthRegisterUser.dto';
import * as dotenv from 'dotenv';
import { ConfirmSignupDto } from './dto/ConfirmSignUp.dto';
import { InitiateAuthDto } from './dto/InitiateAuth.dto';
import { AuthResetPasswordRequestDto } from './dto/AuthResetPasswordReq.dto';
import { AuthResetPasswordConfirmDto } from './dto/AuthResetPasswordConfirm.dto';
import { RefreshTokenDto } from './dto/refreshReq.dto';
import { NewPasswordRequiredDto } from './dto/newPasswordRequired.dto';
import { GlobalSignOutDto } from './dto/globalSignOut.dto';
import { UpdateUserAttributesDto } from './dto/updateUserAttributes.dto';
import { UserService } from 'src/user/user.service';
import * as jwt from 'jsonwebtoken';
import * as jwksClient from 'jwks-rsa';
import { CognitoIdToken } from './cognito.interfaces';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

dotenv.config();

@Injectable()
export class CognitoService {
  private cognitoIdentityProvider: CognitoIdentityProvider;
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {
    this.cognitoIdentityProvider = new CognitoIdentityProvider({
      region: process.env.AWS_REGION,
    });
  }

  /**
   * To use this function, pass an AuthRegisterUserDto object containing the new user's details.
   * This includes 'email', 'password', and 'name'. The function interacts with Amazon Cognito to register the new user.
   *
   * @param authRegisterUserDto An object containing user registration details including email and password.
   * @returns A Promise that resolves to the result of the Cognito sign up operation.
   * @throws BadRequestException if there are invalid parameters, or if a user with the same alias or username already exists.
   */
  async signUp(
    authRegisterUserDto: AuthRegisterUserDto,
  ): Promise<SignUpCommandOutput> {
    const params: SignUpCommandInput = {
      ClientId: process.env.COGNITO_CLIENT_ID,
      Password: authRegisterUserDto.password,
      Username: authRegisterUserDto.email,
      SecretHash: this.hashSecret(
        process.env.COGNITO_CLIENT_SECRET,
        authRegisterUserDto.email,
        process.env.COGNITO_CLIENT_ID,
      ),
      UserAttributes: [
        {
          Name: 'name',
          Value: authRegisterUserDto.name,
        },
      ],
    };

    try {
      const result = await this.cognitoIdentityProvider.signUp(params);

      return result;
    } catch (error) {
      console.log('Signup failed. Error: ', error);
      if (error.name === CognitoErrors.InvalidParameterException) {
        throw new BadRequestException(error.message);
      }
      if (error.name === CognitoErrors.AliasExistsException) {
        throw new ConflictException(error.message);
      }
      if (error.name === CognitoErrors.UsernameExistsException) {
        throw new ConflictException(error.message);
      }
      if (error instanceof InvalidEmailRoleAccessPolicyException)
        throw new InvalidEmailRoleAccessPolicyException({
          message: 'bad email',
          $metadata: error.$metadata,
        });
    }
  }

  /**
   * This function confirms the sign up of a user. To use it, pass a ConfirmSignupDto object containing 'email' and 'confirmationCode'.
   * The function interacts with Amazon Cognito to confirm the user's email after sign up.
   *
   * @param confirmSignUpDto An object containing 'email' and 'confirmationCode' needed for confirming the sign up.
   * @returns A Promise that resolves when the sign up is confirmed.
   * @throws BadRequestException for various types of Cognito-related exceptions such as CognitoErrors.AliasExistsException, 'CodeMismatchException', etc.
   */

  async confirmSignUp(confirmSignUpDto: ConfirmSignupDto): Promise<void> {
    const params = {
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: confirmSignUpDto.email,
      ConfirmationCode: confirmSignUpDto.confirmationCode,
      SecretHash: this.hashSecret(
        process.env.COGNITO_CLIENT_SECRET,
        confirmSignUpDto.email,
        process.env.COGNITO_CLIENT_ID,
      ),
    };

    try {
      await this.cognitoIdentityProvider.confirmSignUp(params);

      await this.userService.confirmUserEmail(confirmSignUpDto.email);
    } catch (error) {
      console.log('Error confirming email:', error);

      switch (error.name) {
        case CognitoErrors.AliasExistsException:
        case CognitoErrors.CodeMismatchException:
        case CognitoErrors.ExpiredCodeException:
        case CognitoErrors.ForbiddenException:
        case CognitoErrors.InvalidLambdaResponseException:
        case CognitoErrors.InvalidParameterException:
        case CognitoErrors.LimitExceededException:
        case CognitoErrors.NotAuthorizedException:
        case CognitoErrors.ResourceNotFoundException:
        case CognitoErrors.TooManyFailedAttemptsException:
        case CognitoErrors.TooManyRequestsException:
        case CognitoErrors.UnexpectedLambdaException:
        case CognitoErrors.UserLambdaValidationException:
          throw new BadRequestException(error.message);
        case CognitoErrors.UserNotFoundException:
          throw new UserNotFoundException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }

  /**
   * Uses Amazon Cognito SDK to resend a confirmation code to a user's email.
   * @param email The email of the user.
   * @returns A Promise that resolves when the confirmation code is sent.
   * @throws Error if there is an issue in the process.
   */
  async resendConfirmationCode(email: string): Promise<void> {
    const params: ResendConfirmationCodeCommandInput = {
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: email,
      SecretHash: this.hashSecret(
        process.env.COGNITO_CLIENT_SECRET,
        email,
        process.env.COGNITO_CLIENT_ID,
      ),
    };

    try {
      await this.cognitoIdentityProvider.send(
        new ResendConfirmationCodeCommand(params),
      );
    } catch (error) {
      console.log('Error resending confirmation code:', error);
      throw new BadRequestException('Failed to resend confirmation code.');
    }
  }

  /**
   * This function signs in a user with Amazon Cognito using 'USER_PASSWORD_AUTH' flow.
   * To use it, pass an InitiateAuthDto object containing 'email' and 'password' of the user.
   *
   * @param initiateAuthDto An object containing 'email' and 'password' for the user to authenticate.
   * @returns A Promise that resolves to the InitiateAuthCommandOutput - an object containing the result of the Cognito initiate authentication operation.
   * @throws BadRequestException if there are invalid parameters.
   * @throws UnauthorizedException if the authentication fails due to invalid credentials.
   */
  async signIn(
    initiateAuthDto: InitiateAuthDto,
  ): Promise<InitiateAuthCommandOutput> {
    const params: InitiateAuthCommandInput = {
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: process.env.COGNITO_CLIENT_ID,
      // UserPoolId: process.env.COGNITO_USER_POOL_ID,
      AuthParameters: {
        USERNAME: initiateAuthDto.email,
        PASSWORD: initiateAuthDto.password,
        SECRET_HASH: this.hashSecret(
          process.env.COGNITO_CLIENT_SECRET,
          initiateAuthDto.email,
          process.env.COGNITO_CLIENT_ID,
        ),
      },
    };

    try {
      const result = await this.cognitoIdentityProvider.initiateAuth(params);
      return result;
    } catch (error) {
      console.log('Login failed. Error: ', error);
      if (
        CognitoErrors.BadRequestsSignInErros.includes(error.name) ||
        error.message === CognitoErrors.PasswordAttemptsExceededMessage
      ) {
        throw new BadRequestException(error.message);
      }
      throw new UnauthorizedException(error.message);
    }
  }

  /**
   * Request a password reset for a user via Amazon Cognito.
   *
   * This function uses Amazon Cognito's ForgotPasswordCommand to initiate a password reset process.
   * Pass in an AuthResetPasswordRequestDto object which should contain the email of the user for whom the reset is intended.
   *
   * @param authResetPasswordRequestDto An object containing 'email' of the user to reset password.
   * @returns A Promise that resolves when the password reset request is successfully sent.
   * @throws BadRequestException if there are invalid parameters or an error occurs in the password reset request process.
   */
  async requestPasswordReset(
    authResetPasswordRequestDto: AuthResetPasswordRequestDto,
  ): Promise<void> {
    const params: ForgotPasswordCommandInput = {
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: authResetPasswordRequestDto.email,
      SecretHash: this.hashSecret(
        process.env.COGNITO_CLIENT_SECRET,
        authResetPasswordRequestDto.email,
        process.env.COGNITO_CLIENT_ID,
      ),
    };

    try {
      await this.cognitoIdentityProvider.send(
        new ForgotPasswordCommand(params),
      );
    } catch (error) {
      console.log('Error requesting password reset:', error);
      if (error.name === CognitoErrors.InvalidParameterException) {
        throw new BadRequestException(
          'Invalid parameters provided for password reset request.',
        );
      } else {
        throw new BadRequestException(
          'Failed to request password reset. Please try again later.',
        );
      }
    }
  }
  /**
   * Confirm a password reset for a user via Amazon Cognito.
   *
   * This function uses Amazon Cognito's ConfirmForgotPasswordCommand to complete a password reset process.
   * Pass in an AuthResetPasswordConfirmDto object which should contain the email of the user, the new password, and the confirmation code received in the user's email.
   *
   * @param authResetPasswordConfirmDto An object containing 'email', 'newPassword' and 'confirmationCode' for the user resetting their password.
   * @returns A Promise that resolves when the password reset is successfully confirmed.
   * @throws BadRequestException if there are invalid parameters or an error occurs during the password reset confirmation process.
   * @throws UnauthorizedException if the confirmation code has expired.
   */
  async confirmPasswordReset(
    authResetPasswordConfirmDto: AuthResetPasswordConfirmDto,
  ): Promise<void> {
    const params: ConfirmForgotPasswordCommandInput = {
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: authResetPasswordConfirmDto.email,
      ConfirmationCode: authResetPasswordConfirmDto.confirmationCode,
      Password: authResetPasswordConfirmDto.newPassword,
      SecretHash: this.hashSecret(
        process.env.COGNITO_CLIENT_SECRET,
        authResetPasswordConfirmDto.email,
        process.env.COGNITO_CLIENT_ID,
      ),
    };

    try {
      await this.cognitoIdentityProvider.send(
        new ConfirmForgotPasswordCommand(params),
      );

      const user = await this.userService.findByEmail(
        authResetPasswordConfirmDto.email,
      );

      await this.adminLogoutUser(user.id);
    } catch (error) {
      console.log('Error confirming password reset:', error);
      if (error.name === CognitoErrors.InvalidParameterException) {
        throw new BadRequestException(
          'Invalid parameters provided for password reset confirmation.',
        );
      } else if (error.name === CognitoErrors.ExpiredCodeException) {
        throw new UnauthorizedException(error.message);
      }
      throw new BadRequestException(
        'Failed to confirm password reset. Please try again later.',
      );
    }
  }

  /**
   * Refresh the Cognito User Pool tokens.
   *
   * This function uses Amazon Cognito's InitiateAuth endpoint with the 'REFRESH_TOKEN_AUTH' flow.
   * The function needs a RefreshTokenDto object which includes the refreshToken and the user's sub.
   * The user's 'sub' is the UUID of the authenticated (signed-in) user. It's not the user's email.
   *
   * @param refreshTokenDto An object containing 'refreshToken' and 'sub' for the user refreshing their tokens.
   * @returns A Promise containing the new authentication result from Cognito.
   * @throws BadRequestException If the provided parameters are invalid.
   * @throws UnauthorizedException If the user's session has expired.
   */
  async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    const params = {
      AuthFlow: 'REFRESH_TOKEN_AUTH',
      ClientId: process.env.COGNITO_CLIENT_ID,
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
      AuthParameters: {
        REFRESH_TOKEN: refreshTokenDto.refreshToken,
        SECRET_HASH: this.hashSecret(
          process.env.COGNITO_CLIENT_SECRET,
          refreshTokenDto.sub,
          process.env.COGNITO_CLIENT_ID,
        ),
      },
    };
    try {
      const result: InitiateAuthCommandOutput =
        await this.cognitoIdentityProvider.initiateAuth(params);
      console.log(result.AuthenticationResult.AccessToken.length);

      const challenge = result.ChallengeName;

      if (challenge) {
        // Handle the challenge response, e.g., MFA, NEW_PASSWORD_REQUIRED, etc.
      } else {
        return result;
      }
    } catch (error) {
      console.log('Login failed. Error: ', error);

      if (error.name === CognitoErrors.InvalidParameterException) {
        throw new BadRequestException('Invalid parameters.');
      } else if (error.name === CognitoErrors.NotAuthorizedException) {
        throw new UnauthorizedException(
          'Your session has expired. Please log in again.',
        );
      } else {
        throw new BadRequestException('An unexpected error occurred.');
      }
    }
  }
  /**
   * Hashes a secret using HMAC SHA256.
   *
   * This function takes a client secret, a username, and a client ID, concatenates the username and client ID,
   * and then hashes the concatenated string using HMAC SHA256 with the client secret as the key. The hash is
   * finally returned as a base64-encoded string.
   *
   * @param clientSecret The secret key used for the HMAC operation.
   * @param username The username to include in the data to be hashed.
   * @param clientId The client ID to include in the data to be hashed.
   * @returns The HMAC SHA256 hash of the username and client ID, using the client secret as the key,
   *          encoded as a base64 string.
   */
  private hashSecret(
    clientSecret: string,
    username: string,
    clientId: string,
  ): string {
    return createHmac('SHA256', clientSecret)
      .update(username + clientId)
      .digest('base64');
  }
  /**
   * Responds to a Cognito challenge requesting a new password.
   *
   * This function takes an instance of `NewPasswordRequiredDto`, which includes the user's email, new password, and the current session.
   * It sends a request to Cognito via the `AdminRespondToAuthChallengeCommand`, indicating that the challenge is `NEW_PASSWORD_REQUIRED`
   * and supplying the new password, user's email (as `USERNAME`), and a hash of the email and client secret (as `SECRET_HASH`). The session
   * provided in the dto is also included in the request.
   *
   * If the challenge is successfully responded to, the function returns the result of the `AdminRespondToAuthChallengeCommand`.
   *
   * The function catches and handles specific errors, throwing appropriate HTTP exceptions.
   *
   * Note: This function requires real-world testing with a valid `NEW_PASSWORD_REQUIRED` challenge, which is not available at the time of writing.
   *
   * @param newPasswordRequiredDto An instance of `NewPasswordRequiredDto`, containing the user's email, new password, and current session.
   * @returns A Promise that resolves to the result of the `AdminRespondToAuthChallengeCommand`.
   * @throws BadRequestException If an `InvalidPasswordException` or other unhandled error is caught.
   * @throws UnauthorizedException If a `NotAuthorizedException` is caught.
   */
  async handleNewPasswordChallenge(
    newPasswordRequiredDto: NewPasswordRequiredDto,
  ): Promise<AdminRespondToAuthChallengeCommandOutput> {
    const params: AdminRespondToAuthChallengeCommandInput = {
      ChallengeName: 'NEW_PASSWORD_REQUIRED',
      ClientId: process.env.COGNITO_CLIENT_ID,
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
      ChallengeResponses: {
        USERNAME: newPasswordRequiredDto.email,
        NEW_PASSWORD: newPasswordRequiredDto.newPassword,
        SECRET_HASH: this.hashSecret(
          process.env.COGNITO_CLIENT_SECRET,
          newPasswordRequiredDto.email,
          process.env.COGNITO_CLIENT_ID,
        ),
      },
      Session: newPasswordRequiredDto.session,
    };

    try {
      const result = await this.cognitoIdentityProvider.send(
        new AdminRespondToAuthChallengeCommand(params),
      );
      return result;
    } catch (error) {
      console.log('Error handling new password challenge:', error);
      if (error.name === CognitoErrors.InvalidPasswordException) {
        throw new BadRequestException(
          'Invalid new password provided. Please ensure your password meets the required complexity rules.',
        );
      } else if (error.name === CognitoErrors.NotAuthorizedException) {
        throw new UnauthorizedException(
          'The provided old password is incorrect.',
        );
      } else {
        throw new BadRequestException(
          'Failed to handle new password challenge. Please try again later.',
        );
      }
    }
  }
  /**
   * Decode and verify an ID token.
   *
   * To use this function, pass the ID token as a string.
   * The function will decode the token using the jsonwebtoken's `decode` method and attempt to verify its authenticity.
   * If successful, the function will return the decoded and verified ID token.
   *
   * @param token The ID token to decode and verify.
   * @returns A Promise that resolves to the decoded and verified ID token.
   * @throws BadRequestException if the token cannot be decoded or is invalid.
   * @throws UnauthorizedException if the token fails verification.
   */
  async decodeAndVerifyIdToken(token: string): Promise<CognitoIdToken> {
    const Jwtclient = jwksClient({
      jwksUri: process.env.COGNITO_AUTHORITY + '/.well-known/jwks.json',
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
    });

    let decodedToken;
    try {
      decodedToken = jwt.decode(token, { complete: true });
    } catch (error) {
      throw new BadRequestException('Failed to decode the token');
    }

    if (!decodedToken || typeof decodedToken === 'string') {
      throw new BadRequestException('Invalid token');
    }

    let key;
    try {
      key = await Jwtclient.getSigningKey(decodedToken.header.kid);
    } catch (error) {
      throw new UnauthorizedException('Failed to get signing key');
    }

    let verifiedToken;
    try {
      verifiedToken = jwt.verify(token, key.getPublicKey(), {
        algorithms: ['RS256'],
      });
    } catch (error) {
      throw new UnauthorizedException('Failed to verify the token');
    }

    return verifiedToken;
  }
  /**
   * Perform a global sign out for a user using the admin user pool API.
   *
   * To use this function, provide the 'sub' (UUID) of the user to be logged out.
   * The function calls the Cognito adminUserGlobalSignOut API endpoint with the provided parameters.
   *
   * @param sub The 'sub' (UUID) of the user to be logged out.
   * @returns A Promise that resolves to the result of the adminUserGlobalSignOut command.
   * @throws BadRequestException if there are invalid parameters for the user logout.
   * @throws UnauthorizedException if the user is not authorized to perform this operation.
   * @throws BadRequestException if there is a failure during the user logout process.
   */
  async adminLogoutUser(
    sub: string,
  ): Promise<AdminUserGlobalSignOutCommandOutput> {
    const params: AdminUserGlobalSignOutCommandInput = {
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
      Username: sub,
    };

    try {
      return this.cognitoIdentityProvider.adminUserGlobalSignOut(params);
    } catch (error) {
      console.log('Error logging out user:', error);
      if (error.name === CognitoErrors.InvalidParameterException) {
        throw new BadRequestException(
          'Invalid parameters provided for user logout.',
        );
      } else if (error.name === CognitoErrors.NotAuthorizedException) {
        throw new UnauthorizedException(
          'User not authorized to perform this operation.',
        );
      } else {
        throw new BadRequestException(
          'Failed to log out user. Please try again later.',
        );
      }
    }
  }
  /**
   * Perform a global sign out for a user using the access token.
   *
   * To use this function, provide the access token of the user in a GlobalSignOutDto object.
   * The function calls the Cognito globalSignOut API endpoint with the provided access token.
   *
   * @param globalSignOutDto An object containing the access token of the user.
   * @returns A Promise that resolves to the result of the globalSignOut command.
   * @throws BadRequestException if there are invalid parameters for the user logout.
   * @throws UnauthorizedException if the user is not authorized to perform this operation.
   * @throws BadRequestException if there is a failure during the user logout process.
   */

  async logoutUser(
    globalSignOutDto: GlobalSignOutDto,
  ): Promise<GlobalSignOutCommandOutput> {
    const param: GlobalSignOutCommandInput = {
      AccessToken: globalSignOutDto.accessToken, // required
    };
    try {
      return await this.cognitoIdentityProvider.globalSignOut(param);
    } catch (error) {
      console.log(error);
      if (error.name === CognitoErrors.InvalidParameterException) {
        throw new BadRequestException(
          'Invalid parameters provided for user logout.',
        );
      } else if (error.name === CognitoErrors.NotAuthorizedException) {
        throw new UnauthorizedException(
          'User not authorized to perform this operation.',
        );
      } else {
        throw new BadRequestException(
          'Failed to log out user. Please try again later.',
        );
      }
    }
  }

  /**
   * Update user attributes using the admin user pool API.
   *
   * To use this function, provide the 'sub' (UUID) of the user and an instance of `UpdateUserAttributesDto` containing the updated user attributes.
   * The function transforms the `updateUserDto` object into the required format for user attributes.
   * It then calls the Cognito adminUpdateUserAttributes API endpoint with the provided parameters.
   *
   * @param sub The 'sub' (UUID) of the user to update attributes for.
   * @param updateUserDto An instance of `UpdateUserAttributesDto` containing the updated user attributes.
   * @returns A Promise that resolves when the user attributes are successfully updated.
   * @throws BadRequestException if there are invalid parameters for updating user attributes.
   * @throws UnauthorizedException if the user is not authorized to perform this operation.
   * @throws BadRequestException if there is a failure during the user attributes update process.
   */
  async updateUserAttributes(
    sub: string,
    updateUserDto: UpdateUserAttributesDto,
  ): Promise<void> {
    const transformedAttributes =
      this.transformObjectToAttributes(updateUserDto);

    const params: AdminUpdateUserAttributesCommandInput = {
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
      Username: sub,
      UserAttributes: transformedAttributes,
    };

    try {
      await this.cognitoIdentityProvider.send(
        new AdminUpdateUserAttributesCommand(params),
      );
    } catch (error) {
      console.log('Error updating user attributes:', error);
      if (error.name === CognitoErrors.InvalidParameterException) {
        throw new BadRequestException(
          'Invalid parameters provided for updating user attributes.',
        );
      } else if (error.name === CognitoErrors.NotAuthorizedException) {
        throw new UnauthorizedException(
          'User not authorized to perform this operation.',
        );
      } else {
        throw new BadRequestException(error.message);
      }
    }
  }
  /**
   * Transform an object into an array of user attributes.
   *
   * This function takes an object and transforms it into an array of user attributes.
   * Each key-value pair in the object is converted into an attribute object with a 'Name' and 'Value' property.
   *
   * @param obj The object to transform into user attributes.
   * @returns An array of user attributes, where each attribute object has a 'Name' and 'Value' property.
   */
  transformObjectToAttributes(
    obj: Record<string, any>,
  ): { Name: string; Value: any }[] {
    return Object.entries(obj).map(([key, value]) => ({
      Name: key,
      Value: value,
    }));
  }

  async adminSignUpForgoogle(
    adminAuthRegisterUserDto: AdminAuthRegisterUserDto,
  ): Promise<InitiateAuthCommandOutput> {
    const params: AdminCreateUserCommandInput = {
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
      Username: adminAuthRegisterUserDto.email,
      MessageAction: 'SUPPRESS',
      UserAttributes: [
        {
          Name: 'name',
          Value: adminAuthRegisterUserDto.name,
        },
        {
          Name: 'email',
          Value: adminAuthRegisterUserDto.email,
        },
        {
          Name: 'email_verified',
          Value: `${adminAuthRegisterUserDto.emailVerified}`,
        },
      ],
    };

    try {
      const adminCreateUserCommandOutput: AdminCreateUserCommandOutput =
        await this.cognitoIdentityProvider.adminCreateUser(params);

      const attributes = adminCreateUserCommandOutput.User.Attributes;

      const DBRegisterParams: CreateUserDto = {
        id: attributes.find((attr) => attr.Name === 'sub').Value,
        email: attributes.find((attr) => attr.Name === 'email').Value,
        name: attributes.find((attr) => attr.Name === 'name').Value,
        phone_number: '',
        confirmEmail: true, // It seems like you don't have a phone number in the attributes, so this is left empty.
      };

      await this.userService.register(DBRegisterParams);

      const emailHash = this.generateShortHash(adminAuthRegisterUserDto.email);
      const passwordWithHash = adminAuthRegisterUserDto.password + emailHash;
      // Set permanent password
      const passwordParams: AdminSetUserPasswordCommandInput = {
        UserPoolId: process.env.COGNITO_USER_POOL_ID,
        Username: adminAuthRegisterUserDto.email,
        Password: passwordWithHash + process.env.PASSWORD_SECRET,
        Permanent: true,
      };

      await this.cognitoIdentityProvider.adminSetUserPassword(passwordParams);

      return await this.adminSignInGoogle({
        email: adminAuthRegisterUserDto.email,
        password: adminAuthRegisterUserDto.password,
      });
    } catch (error) {
      if (error.name === CognitoErrors.InvalidParameterException) {
        throw new BadRequestException(error.message);
      }
      if (
        error.name === CognitoErrors.UsernameExistsException ||
        error.name === CognitoErrors.AliasExistsException
      ) {
        try {
          return await this.adminSignInGoogle({
            email: adminAuthRegisterUserDto.email,
            password: adminAuthRegisterUserDto.password,
          });
        } catch (error) {
          if (
            error instanceof BadRequestException ||
            error instanceof UnauthorizedException
          ) {
            const isUserExist = await this.userService.findByEmail(
              adminAuthRegisterUserDto.email,
            );
            if (isUserExist) {
              throw new ConflictException(
                'a user alredy register with this email in a different provider',
              );
            } else {
              throw error;
            }
          }
        }
      }
      throw error;
    }
  }
  async adminSignInGoogle(
    initiateAuthDto: InitiateAuthDto,
  ): Promise<InitiateAuthCommandOutput> {
    const emailHash = this.generateShortHash(initiateAuthDto.email);
    const passwordWithHash = initiateAuthDto.password + emailHash;
    const params: InitiateAuthCommandInput = {
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: process.env.COGNITO_CLIENT_ID,
      // UserPoolId: process.env.COGNITO_USER_POOL_ID,
      AuthParameters: {
        USERNAME: initiateAuthDto.email,
        PASSWORD: passwordWithHash + process.env.PASSWORD_SECRET,
        SECRET_HASH: this.hashSecret(
          process.env.COGNITO_CLIENT_SECRET,
          initiateAuthDto.email,
          process.env.COGNITO_CLIENT_ID,
        ),
      },
    };

    try {
      const result: InitiateAuthCommandOutput =
        await this.cognitoIdentityProvider.initiateAuth(params);

      return result;
    } catch (error) {
      if (error.name === CognitoErrors.InvalidParameterException) {
        throw new BadRequestException(error.message);
      }
      throw new UnauthorizedException(error.message);
    }
  }
  generateShortHash(email: string): string {
    const hash = createHash('sha256').update(email).digest('hex');
    return hash.substring(0, 8);
  }
}
