import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaNotFoundExceptionFilter } from './exception-filters/prisma-not-found.exception';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: 422,
    }),
  );

  enableShutdownHooks(app);

  app.useGlobalFilters(new PrismaNotFoundExceptionFilter());
  await app.listen(3000);
}
bootstrap();

function enableShutdownHooks(app: INestApplication) {
  process.on('beforeExit', async () => {
    console.log('Closing the application...');
    await app.close();
    console.log('Application closed');
  });
}
