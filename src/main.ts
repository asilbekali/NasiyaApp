import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './api/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Nasiya App example')
    .setDescription('The Nasiya App API description')
    .setVersion('1.0')
    .addBearerAuth()
    .addSecurityRequirements('bearer', ['bearer'])
    .addTag('Nasiya App')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
  console.log(
    '\n\x1b[42m%s\x1b[0m\x1b[32m %s\x1b[0m\n',
    ' Swagger ',
    `http://localhost:${process.env.PORT ?? 3000}/api 🚀`,
  );
}

bootstrap();
