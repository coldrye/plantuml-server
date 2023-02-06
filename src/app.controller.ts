import { Body, Controller, Header, Post, StreamableFile } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('url/svg')
  @Header('Content-type', 'image/svg+xml')
  async renderSvgFromUrl(@Body() body : { url: string }): Promise<string> {
    const url = Buffer.from(body.url, 'base64').toString('utf8');
    return this.appService.renderSvgFromUrl(url).then(buffer => buffer.toString('utf8'));
  }

  @Post('url/png')
  @Header('Content-type', 'image/png')
  async renderPngFromUrl(@Body() body : { url: string }): Promise<StreamableFile> {
    const url = Buffer.from(body.url, 'base64').toString('utf8');
    return this.appService.renderPngFromUrl(url).then(buffer => Promise.resolve(new StreamableFile(buffer)));
  }

  @Post('document/svg')
  @Header('Content-type', 'image/svg+xml')
  async renderSvgFromDocument(@Body() body : { content: string }): Promise<string> {
    const document = Buffer.from(body.content, 'base64').toString('utf8');
    return this.appService.renderSvg(document).then(buffer => Promise.resolve(buffer.toString('utf8')));
  }

  @Post('document/png')
  @Header('Content-type', 'image/png')
  async renderPngFromDocument(@Body() body : { content: string }): Promise<StreamableFile> {
    const document = Buffer.from(body.content, 'base64').toString('utf8');
    return this.appService.renderPng(document).then(buffer => Promise.resolve(new StreamableFile(buffer)));
  }
}
