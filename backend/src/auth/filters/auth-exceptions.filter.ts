import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Type,
} from '@nestjs/common';
import {
  AuthDomainError,
  EmailAlreadyExistsError,
  InvalidCredentialsError,
  InvalidTokenError,
} from '../erros';
import { Response } from 'express';

@Catch(AuthDomainError)
export class AuthExceptionsFilter implements ExceptionFilter {
  private readonly statusMap = new Map<Type<AuthDomainError>, HttpStatus>([
    [EmailAlreadyExistsError, HttpStatus.CONFLICT],
    [InvalidCredentialsError, HttpStatus.UNAUTHORIZED],
    [InvalidTokenError, HttpStatus.UNAUTHORIZED],
  ]);

  catch(exception: AuthDomainError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const exceptionType = exception.constructor as Type<AuthDomainError>;
    const status =
      this.statusMap.get(exceptionType) || HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json({
      statusCode: status,
      error: exception.name,
      message: exception.message,
    });
  }
}
