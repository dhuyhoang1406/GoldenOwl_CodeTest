import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SeederService } from './common/seeder/seeder.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['log', 'error', 'warn'],
  });
  try {
    await app.get(SeederService).seed();
  } finally {
    await app.close();
  }
}

bootstrap().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
