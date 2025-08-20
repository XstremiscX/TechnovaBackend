import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('E-commerce API')
    .setDescription('API for managing users, products, and purchases')
    .setVersion('1.0')
    .addBearerAuth() // Para endpoints protegidos con JWT
    .build();
  const document = SwaggerModule.createDocument(app, config);
  
  SwaggerModule.setup('api', app, document); // Sirve Swagger UI en /api (opcional)

  // Exponer el archivo OpenAPI JSON
  app.getHttpAdapter().get('/api-json', (req, res) => {
    res.json(document);
  });

  // Guardar openapi.json en la carpeta docs
  writeFileSync(join(__dirname, '..', 'docs', 'openapi.json'), JSON.stringify(document, null, 2));

  app.enableCors({
    origin: "http://localhost:4200",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true
  })

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }))
  await app.listen(process.env.PORT ?? 3000);

  
}

bootstrap();
