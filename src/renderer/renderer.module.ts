import { MiddlewareConsumer, Module } from '@nestjs/common';
import { Base64EncodedBodyMiddleware } from 'src/middlewares/base64.middleware';
import { RendererController } from './renderer.controller';
import { RendererService } from './renderer.service';

@Module({
  imports: [],
  controllers: [RendererController],
  providers: [RendererService],
})
export class RendererModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(Base64EncodedBodyMiddleware)
      .forRoutes('render');
  }
}
