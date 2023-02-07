import { Body, Controller, Header, Post, Req, RawBodyRequest, StreamableFile } from '@nestjs/common';
import { AppService } from './app.service';

export type RawBase64EncodedRequest<T> = T & {
  base64Encoded?: string;
  base64Decoded?: string;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('url/svg')
  @Header('Accept', 'text/plain')
  @Header('Content-type', 'image/svg+xml')
  async renderSvgFromUrl(@Req() req: RawBase64EncodedRequest<Request>): Promise<string> {
    console.log(req.base64Encoded);
    console.log(req.base64Decoded);
    const url = req.base64Decoded;
    return this.appService.renderSvgFromUrl(url).then(buffer => buffer.toString('utf8'));
  }

  @Post('url/png')
  @Header('Accept', 'text/plain')
  @Header('Content-type', 'image/png')
  async renderPngFromUrl(@Req() req: RawBase64EncodedRequest<Request>): Promise<StreamableFile> {
    const url = req.base64Decoded;
    return this.appService.renderPngFromUrl(url).then(buffer => Promise.resolve(new StreamableFile(buffer)));
  }

  @Post('document/svg')
  @Header('Accept', 'text/plain')
  @Header('Content-type', 'image/svg+xml')
  async renderSvgFromDocument(@Req() req: RawBase64EncodedRequest<Request>): Promise<string> {
    const document = req.base64Decoded;
    return this.appService.renderSvg(document).then(buffer => Promise.resolve(buffer.toString('utf8')));
  }

  @Post('document/png')
  @Header('Accept', 'text/plain')
  @Header('Content-type', 'image/png')
  async renderPngFromDocument(@Req() req: RawBase64EncodedRequest<Request>): Promise<StreamableFile> {
    const document = req.base64Decoded;
    return this.appService.renderPng(document).then(buffer => Promise.resolve(new StreamableFile(buffer)));
  }
}
