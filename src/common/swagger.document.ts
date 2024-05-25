import { DocumentBuilder } from '@nestjs/swagger';

export class BaseAPIDocument {
  public builder = new DocumentBuilder();

  public initializeOptions() {
    return this.builder
      .setTitle('kangho api')
      .setDescription('kangho api description')
      .addBearerAuth()
      .setVersion('1.0')
      .addTag('kangho')
      .build();
  }
}
