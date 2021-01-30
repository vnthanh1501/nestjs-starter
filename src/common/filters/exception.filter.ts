import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
// import { LogService } from '../modules/custom-log/log.service';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  // logService: LogService;
  // constructor(logService: LogService) {
  //   this.logService = logService;
  // }
  async catch(exception: unknown, host: ArgumentsHost): Promise<void> {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    // const loggedId = await this.logService.writeLog(exception, request);

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const detail =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'INTERNAL_SERVER_ERROR';

    response
      .set({
        'Access-Control-Allow-Origin': '*',
      })
      .status(status)
      .json({
        success: false,
        path: request.url,
        timestamp: new Date().toISOString(),
        detail,
        // loggedId,
      });
  }
}
