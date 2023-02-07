import { Injectable, NestMiddleware } from '@nestjs/common';
import { text } from 'body-parser';
import { NextFunction, Request, Response } from 'express';

export type Base64EncodedBodyRequest<T> = T & {
    base64EncodedBody?: string;
    base64DecodedBody?: string;
}

@Injectable()
export class Base64EncodedBodyMiddleware implements NestMiddleware {
  use(req: Base64EncodedBodyRequest<Request>, res: Response, next: NextFunction) {
    text({
        verify: (req: Base64EncodedBodyRequest<Request>, res, buffer) => {
            if (Buffer.isBuffer(buffer)) {
                req.base64EncodedBody = buffer.toString();
                req.base64DecodedBody = Buffer.from(req.base64EncodedBody, 'base64').toString('utf8');
              }
            return true;
        }
    })(req, res, next);
  }
}
