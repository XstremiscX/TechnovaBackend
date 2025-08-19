import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import * as sanitizeHtml from 'sanitize-html';

//Este pipe se encargara de analizar y prevenir inserciones de XSS en los datos que se envian al servidor
@Injectable()
export class XssAtackPreventionPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
  if (Array.isArray(value)) {
    for (const item of value) {
      for (const key in item) {
        if (typeof item[key] === 'string') {
          item[key] = sanitizeHtml(item[key], {
            allowedTags: [],
            allowedAttributes: {}
          });
        }
      }
    }
  } else if (typeof value === 'object') {
    for (const key in value) {
      if (typeof value[key] === 'string') {
        value[key] = sanitizeHtml(value[key], {
          allowedTags: [],
          allowedAttributes: {}
        });
      }
    }
  } else if (typeof value === 'string') {
    value = sanitizeHtml(value, {
      allowedTags: [],
      allowedAttributes: {}
    });
  }

  return value;
}

}
