import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Type,
} from '@nestjs/common';
import { Response } from 'express';
import {
  MissionsDomainError,
  MissionNotFoundError,
  MissionAlreadyCompletedError,
  PrerequisitesNotMetError,
} from '../errors';

@Catch(MissionsDomainError)
export class MissionsExceptionsFilter implements ExceptionFilter {
  private readonly statusMap = new Map<Type<MissionsDomainError>, HttpStatus>([
    [MissionNotFoundError, HttpStatus.NOT_FOUND],
    [MissionAlreadyCompletedError, HttpStatus.CONFLICT],
    [PrerequisitesNotMetError, HttpStatus.FORBIDDEN],
  ]);

  catch(exception: MissionsDomainError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const exceptionType = exception.constructor as Type<MissionsDomainError>;
    const status =
      this.statusMap.get(exceptionType) || HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json({
      statusCode: status,
      error: exception.name,
      message: exception.message,
    });
  }
}
