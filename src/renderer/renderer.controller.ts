import { Controller, Get, Header, Param, Post, Req, StreamableFile } from '@nestjs/common';
import { Request } from 'express';
import { Base64PipeTransform } from 'src/transformers/base64.transform';
import { Base64EncodedBodyRequest } from '../middlewares/base64.middleware';
import { RendererService } from './renderer.service';

@Controller('render')
export class RendererController {
  constructor(private readonly rendererService: RendererService) {}

  @Post('url/svg')
  @Header('Accept', 'text/plain')
  @Header('Content-type', 'image/svg+xml')
  async renderSvgFromUrl(@Req() req: Base64EncodedBodyRequest<Request>): Promise<string> {
    const url = req.base64DecodedBody;
    return this.rendererService.renderSvgFromUrl(url).then(buffer => buffer.toString('utf8'));
  }

  @Get('url/svg/:url')
  @Header('Content-type', 'image/svg+xml')
  async renderSvgFromUrlWithParam(@Param('url', Base64PipeTransform) url: string): Promise<string> {
    return this.rendererService.renderSvgFromUrl(url).then(buffer => buffer.toString('utf8'));
  }

  @Post('url/png')
  @Header('Accept', 'text/plain')
  @Header('Content-type', 'image/png')
  async renderPngFromUrl(@Req() req: Base64EncodedBodyRequest<Request>): Promise<StreamableFile> {
    const url = req.base64DecodedBody;
    return this.rendererService.renderPngFromUrl(url).then(buffer => Promise.resolve(new StreamableFile(buffer)));
  }

  @Get('url/png/:url')
  @Header('Content-type', 'image/png')
  async renderPngFromUrlWithParam(@Param('url', Base64PipeTransform) url: string): Promise<StreamableFile> {
    return this.rendererService.renderPngFromUrl(url).then(buffer => Promise.resolve(new StreamableFile(buffer)));
  }

  @Post('document/svg')
  @Header('Accept', 'text/plain')
  @Header('Content-type', 'image/svg+xml')
  async renderSvgFromDocument(@Req() req: Base64EncodedBodyRequest<Request>): Promise<string> {
    const document = req.base64DecodedBody;
    return this.rendererService.renderSvg(document).then(buffer => Promise.resolve(buffer.toString('utf8')));
  }

  @Post('document/png')
  @Header('Accept', 'text/plain')
  @Header('Content-type', 'image/png')
  async renderPngFromDocument(@Req() req: Base64EncodedBodyRequest<Request>): Promise<StreamableFile> {
    const document = req.base64DecodedBody;
    return this.rendererService.renderPng(document).then(buffer => Promise.resolve(new StreamableFile(buffer)));
  }
}
