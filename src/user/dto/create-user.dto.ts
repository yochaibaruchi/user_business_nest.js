import { IsNotEmpty, IsEmail, IsString, MinLength ,Length, Matches, Validate, MaxLength,   } from 'class-validator';
import { IsPasswordConfirmed } from '../is-password-confirmed.validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'The first name of the user.', maxLength: 50 , type : String, required : true })
  @MaxLength(50)
  @IsNotEmpty()
  @IsString()
  firstName: string;
  
  @ApiProperty({ description: 'The last name of the user.', maxLength: 50 , type : String , required : true})
  @MaxLength(50)
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({ description: 'The email address of the user.', type : String , format : 'email' , required : true})
  @IsNotEmpty()
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;


  @ApiProperty({ description: 'The user password.', minLength: 8, maxLength: 24 , type :String ,required : true })
  @IsNotEmpty()
  @IsString()
  @Length(8, 24, { message: 'Password must be between 8 and 24 characters' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,24}$/, { message: 'Password must contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character' })
  password: string;


  @ApiProperty({ description: 'The password confirmation.' , type : String  ,required : true})
  @IsNotEmpty()
  confirmPassword: string;


 @ApiProperty({ description: 'The phone number of the user.', minLength: 10 , type : String , required : true})
  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  phone: string;
 
  @ApiProperty({ description: 'Indicates if the user is an admin.' , type : Boolean, required : true })  
  @IsNotEmpty()
  isAdmin: boolean;

@Validate(IsPasswordConfirmed)
matchingPasswords : Boolean
}
