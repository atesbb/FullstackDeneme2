import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import { apiGlobalPrefix, projectConfig } from './app/configs/project.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(apiGlobalPrefix);

  // Setup swagger
  const options = new DocumentBuilder().build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors();

  const { port } = projectConfig.api;
  await app.listen(port, () => {
    Logger.log('Listening at http://localhost:' + port + '/' + apiGlobalPrefix);
  });
}

bootstrap();
