const InvalidParameterException = 'InvalidParameterException';
const AliasExistsException = 'AliasExistsException';
const UsernameExistsException = 'UsernameExistsException';
const CodeMismatchException = 'CodeMismatchException';
const ExpiredCodeException = 'ExpiredCodeException';
const ForbiddenException = 'ForbiddenException';
const InvalidLambdaResponseException = 'InvalidLambdaResponseException';
const LimitExceededException = 'LimitExceededException';
const NotAuthorizedException = 'NotAuthorizedException';
const ResourceNotFoundException = 'ResourceNotFoundException';
const TooManyRequestsException = 'TooManyRequestsException';
const UnexpectedLambdaException = 'UnexpectedLambdaException';
const UserLambdaValidationException = 'UserLambdaValidationException';
const TooManyFailedAttemptsException = 'TooManyFailedAttemptsException';
const UserNotFoundException = 'UserNotFoundException';
const InvalidPasswordException = 'InvalidPasswordException';
const PasswordAttemptsExceededMessage = 'Password attempts exceeded';

const BadRequestsSignInErros = [
  LimitExceededException,
  TooManyFailedAttemptsException,
  TooManyRequestsException,
  InvalidParameterException,
];
export default {
  BadRequestsSignInErros,
  PasswordAttemptsExceededMessage,
  InvalidPasswordException,
  UserNotFoundException,
  TooManyFailedAttemptsException,
  UserLambdaValidationException,
  UnexpectedLambdaException,
  TooManyRequestsException,
  ResourceNotFoundException,
  NotAuthorizedException,
  LimitExceededException,
  ForbiddenException,
  ExpiredCodeException,
  CodeMismatchException,
  InvalidLambdaResponseException,
  InvalidParameterException,
  AliasExistsException,
  UsernameExistsException,
};
