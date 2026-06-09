import {
  Catch,
  Logger,
  HttpStatus,
  ArgumentsHost,
  HttpException,
  ExceptionFilter,
} from '@nestjs/common';

const logger = new Logger('GlobalException');

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    logger.error(exception.message, exception.stack);
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();
    const req = ctx.getRequest();

    const isDev = process.env.NODE_ENV === 'development';

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Something went very wrong';
    let status = 'error';

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();

      const response: any = exception.getResponse();

      message = response?.message || exception.message;
      status = statusCode < 500 ? 'fail' : 'error';
    }

    if (exception.name === 'JsonWebTokenError') {
      statusCode = 401;
      message = 'Invalid token';
    }

    if (exception.name === 'TokenExpiredError') {
      statusCode = 401;
      message = 'Token expired, please login again';
    }

    if (exception.code === 'P2002') {
      statusCode = 400;
      message = 'Duplicate field value';
    }

    if (exception.code === 'P2003') {
      statusCode = 400;
      message = 'Invalid reference ID';
    }

    if (exception.code === 'P2025') {
      statusCode = 404;
      message = 'Record not found';
    }

    if (isDev) {
      return res.status(statusCode).json({
        status,
        message,
        stack: exception.stack,
        path: req.url,
      });
    }

    return res.status(statusCode).json({
      status,
      message,
    });
  }
}
