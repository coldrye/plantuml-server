import { ArgumentMetadata, PipeTransform } from "@nestjs/common";

export class Base64PipeTransform implements PipeTransform<string, string> {
    transform(value: string, _metadata: ArgumentMetadata): string {
        return Buffer.from(value, 'base64').toString('utf8');
    }
}
