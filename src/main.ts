import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { BaseAPIDocument } from './common/swagger.document';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService: ConfigService = app.get(ConfigService);

  app.setGlobalPrefix('api');
  app.use(cookieParser());
  // swaggerSetup
  // const config = new DocumentBuilder()
  //   .setTitle('kangho api')
  //   .setDescription('kangho api description')
  //   .addBearerAuth()
  //   .setVersion('1.0')
  //   .addTag('kangho')
  //   .build();
  const config = new BaseAPIDocument().initializeOptions();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  app.useGlobalPipes(
    new ValidationPipe({ skipMissingProperties: true, transform: true }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  const port = configService.get('SERVER_PORT') || 9000;
  await app.listen(port);
}
bootstrap();
