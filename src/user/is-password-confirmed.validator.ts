import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
  } from 'class-validator';
import { CreateUserDto } from './dto/create-user.dto';
  
  @ValidatorConstraint({ name: 'isPasswordConfirmed', async: false })
  export class IsPasswordConfirmed implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments) {
      const dto: CreateUserDto = args.object as CreateUserDto;
      return dto.password === dto.confirmPassword;
    }
  
    defaultMessage(args: ValidationArguments) {
      return 'Password and confirmPassword must match';
    }
  }
  