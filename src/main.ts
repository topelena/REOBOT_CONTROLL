
import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { NavigateDto, Position } from './robot/dto';


async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  app.setGlobalPrefix('api', { exclude: ['health'] });
  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.enableShutdownHooks();

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Robot controll API')
    .setDescription(`Robot that can walk around in a room API `)
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [
      NavigateDto, Position
    ],
  });
  SwaggerModule.setup('swagger', app, document);
  await app.listen(process.env.PORT || 8080, '0.0.0.0');
}

bootstrap();

