import { HttpException, HttpStatus } from '@nestjs/common';
export class AppException extends HttpException {
  public isOperational: boolean;

  constructor(
    message: string,
    statusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
    isOperational = true,
  ) {
    super(
      {
        status: statusCode < 500 ? 'fail' : 'error',
        message,
      },
      statusCode,
    );

    this.isOperational = isOperational;
  }
}

const IfAppError = (condition: any, message: string, statusCode: number) => {
  if (condition) throw new AppException(message, statusCode);
};

export default IfAppError;
