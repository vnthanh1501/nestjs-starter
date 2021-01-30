import { HttpException, HttpStatus } from '@nestjs/common';
import { ResponseMessage } from '@app/common/langs/en'

export const customThrowError = (
  message: typeof ResponseMessage,
  code: HttpStatus,
  errorCode?: string,
  error?: Error,
): void => {
  throw new HttpException({ message, errorCode, error }, code);
};
