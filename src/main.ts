import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  app.use(helmet());
  app.use(cookieParser())




  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector))
  );


  const config = new DocumentBuilder()
    .setTitle('User Microservice API')
    .setDescription('User microservice API documentation')
    .setVersion('1.0')
    .addTag('user')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
function cookieParser(): any {
  throw new Error('Function not implemented.');
}

