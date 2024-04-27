import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService: ConfigService = app.get(ConfigService);

  // swaggerSetup
  const config = new DocumentBuilder()
    .setTitle('kangho api')
    .setDescription('kangho api description')
    .setVersion('1.0')
    .addTag('kangho')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  const port = configService.get('SERVER_PORT') || 9000;
  await app.listen(port);
}
bootstrap();
