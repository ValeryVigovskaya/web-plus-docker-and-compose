import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
//import helmet from 'helmet';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston/dist/winston.constants';
import { AllExceptionsFilter } from './interceptors/exceptions-filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.use(helmet());
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  //без прямого прописывания не работает фронт
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Accept,Authorization',
    credentials: true,
  });
  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(3000);
}
bootstrap();
