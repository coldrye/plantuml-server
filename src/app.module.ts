import { Module } from '@nestjs/common';
import { RendererModule } from './renderer/renderer.module';

@Module({
  imports: [RendererModule]
})
export class AppModule {}
