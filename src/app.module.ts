import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticateMiddleware } from '@app/common/middlewares/authentication.middleware';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TokenHelper } from './common/helpers/token.helper';

const env = process.env.NODE_ENV || 'development';
const envFilePath =
  env === 'development' ? '.env' : `.env${process.env.NODE_ENV}`;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get('DB_HOST'),
          port: +configService.get<number>('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database:configService.get('DB_NAME'),
          entities: ['src/**/**.entity{.ts,.js}'],
        };
      },
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    
  ],
  controllers: [AppController],
  providers: [ AppService, TokenHelper ],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AuthenticateMiddleware).forRoutes('*');
  }
}