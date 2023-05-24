import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { AuthRegisterUserDto } from './dto/AuthRegisterUser.dto';
import { AuthResetPasswordConfirmDto } from './dto/AuthResetPasswordConfirm.dto';

@ValidatorConstraint({ name: 'isPasswordConfirmed', async: false })
export class IsPasswordConfirmed implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const dto: AuthRegisterUserDto = args.object as AuthRegisterUserDto;
    return dto.password === dto.confirmPassword;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Password and confirmPassword must match';
  }
}
@ValidatorConstraint({ name: 'isNewPasswordConfirmed', async: false })
export class IsNewPasswordConfirmed implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const dto: AuthResetPasswordConfirmDto =
      args.object as AuthResetPasswordConfirmDto;
    return dto.newPassword === dto.confirmPassword;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Password and confirmPassword must match';
  }
}
