import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true }),
    new ValidationPipe({
      transform: true,
      transformOptions: { groups: ['transform'] },
    }),
  );
  const config = new DocumentBuilder()
    .setTitle('Sign Adress API')
    .setDescription(
      'This Api allows you to register, edit, delete and manage all your addresses. It has the following additional features: Calculation of how many days are left until the next birthday and if the birthday coincides with the day of registration, a personalized message will be sent to the user, filtered based on gender and pagination implementation.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();
