import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication, INestMicroservice } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  

  const config = new DocumentBuilder()
    .setTitle('API Documentation for Authentaction')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

    const document = SwaggerModule.createDocument(app , config);
    SwaggerModule.setup('api', app, document);
  await app.listen(3000);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: { host: 'localhost', port: 3001 },
  });

  await app.startAllMicroservices();
}
bootstrap();
