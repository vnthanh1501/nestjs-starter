import { ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as morgan from 'morgan';

import { AppModule } from './app.module';
import { validationExceptionFactory } from './common/factories/validation-exception.factory';
import { ConfigService } from '@nestjs/config';
import { RoleAuthenticationGuard } from './common/guards/role.guard';
import { UserService } from './modules/user/user.service';
import { UserModule } from './modules/user/user.module';
import { FormatResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  // config service instance
  const configService: ConfigService = app.get(ConfigService);

  // use morgan
  app.use(morgan('dev'));

  // register validation pipe with custom error formatting factory
  app.useGlobalPipes(new ValidationPipe({
    exceptionFactory: validationExceptionFactory,
  }));

  // register interceptor
  app.useGlobalInterceptors(
    new FormatResponseInterceptor(),
  );

  // register role guard (check user role) to global
  const userService = app.select(UserModule).get(UserService);
  app.useGlobalGuards(
    new RoleAuthenticationGuard(new Reflector(), userService),
  );

  // swagger options
  const swaggerOptions = new DocumentBuilder()
    .setTitle('Network Core API')
    .setDescription('REST API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup('api-docs', app, swaggerDocument);

  // start the app
  await app.listen(configService.get('APP_PORT'));
}

bootstrap();
