import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filter/all-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from "express"

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidNonWhitelisted: true,
      whitelist: true,
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter())

  //swagger
  const config = new DocumentBuilder()
  .setTitle('Job Search API (HH Clone)')
  .setDescription('The Job Search API description')
  .setVersion('1.0')
  .addBearerAuth({
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
    name: 'JWT',
    description: 'Enter JWT token',
    in: 'header'
  },
  'JWT-auth'
)
  .build()

  const document = SwaggerModule.createDocument(app, config)

  SwaggerModule.setup("api", app, document, {
    swaggerOptions: {
      persistAuthorization: true
    }
  })

  app.use("/uploads", express.static("uploads"))


  const PORT = process.env.PORT ?? 3000


   await app.listen(PORT, () => {
    console.log("Server is running at : http://localhost:4001");
    console.log("Documantation link : http://localhost:4001/api");
  });
}
bootstrap();
