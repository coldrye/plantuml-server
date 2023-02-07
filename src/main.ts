import { NestFactory } from '@nestjs/core';
import * as bodyParser from 'body-parser';
import { AppModule } from './app.module';

function decodeBase64EncodedString(req, _res, buffer) {
  if (Buffer.isBuffer(buffer)) {
    req.base64Encoded = buffer.toString();
    req.base64Decoded = Buffer.from(req.base64Encoded, 'base64').toString('utf8');
  }
  return true;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: console, bodyParser: false });
  const textBodyParser = bodyParser.text({ verify: decodeBase64EncodedString });
  app.use(textBodyParser);
  await app.listen(8080);
}
bootstrap();
