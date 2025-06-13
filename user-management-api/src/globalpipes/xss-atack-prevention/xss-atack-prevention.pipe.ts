import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import * as sanitizeHtml from 'sanitize-html';

//Este pipe se encargara de analizar y prevenir inserciones de XSS en los datos que se envian al servidor
@Injectable()
export class XssAtackPreventionPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {

    // Si el valor obtenido es un objeton, entonces recorrera las propiedades del objeto y sanitizara los datos de tipo string.
    // Si el valor obtenido es un string, entonces lo sanitizara directamente.
    if(typeof value === 'object') {
      for (const valueKey in value) {
        if (typeof valueKey === "string"){
            value[valueKey] = sanitizeHtml(value[valueKey], {
            allowedTags: [],
            allowedAttributes: {}
          });
        }
      }
    }else if( typeof value === 'string') {
      value = sanitizeHtml(value, {
        allowedTags: [],
        allowedAttributes: {}
      });
    }

    // Retorna el valor sanitizado
    return value;
  }
}
