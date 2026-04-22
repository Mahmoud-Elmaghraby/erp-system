
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { PrismaClientKnownRequestError } from '../../../../../generated/prisma/runtime/client';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Prisma errors
    if (exception instanceof PrismaClientKnownRequestError) {
      const prismaError = exception as PrismaClientKnownRequestError;

      const statusMap: Record<string, number> = {
        P2002: HttpStatus.CONFLICT,
        P2025: HttpStatus.NOT_FOUND,
        P2003: HttpStatus.BAD_REQUEST,
        P2014: HttpStatus.BAD_REQUEST,
      };

      const messageMap: Record<string, string> = {
        P2002: 'هذا السجل موجود بالفعل',
        P2025: 'السجل غير موجود',
        P2003: 'خطأ في ارتباط البيانات',
        P2014: 'خطأ في ارتباط البيانات',
      };

      const status = statusMap[prismaError.code] ?? HttpStatus.INTERNAL_SERVER_ERROR;

      response.status(status).json({
        statusCode: status,
        error: prismaError.code,
        message: [messageMap[prismaError.code] ?? 'خطأ في قاعدة البيانات'],
        timestamp: new Date().toISOString(),
        path: request.url,
      });

      return;
    }

    // HTTP exceptions
    const isHttpException = exception instanceof HttpException;
    const status = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse = isHttpException ? exception.getResponse() : null;

    let message: string | string[] = 'Internal server error';

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else if (
      typeof exceptionResponse === 'object' &&
      exceptionResponse !== null
    ) {
      message =
        (exceptionResponse as any)['message'] ??
        (exception as HttpException).message;
    }

    if (!isHttpException) {
      this.logger.error(
        `[${request.method}] ${request.url}`,
        (exception as Error)?.stack,
      );
    }

    response.status(status).json({
      statusCode: status,
      error: isHttpException
        ? (exception as HttpException).name
        : 'InternalServerError',
      message: Array.isArray(message) ? message : [message],
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}

