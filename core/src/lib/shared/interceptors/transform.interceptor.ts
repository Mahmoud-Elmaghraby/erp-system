import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(
      map(data => {
        const cleanedData = this.transformDecimalObjects(data);

        if (cleanedData && typeof cleanedData === 'object' && 'data' in cleanedData && 'meta' in cleanedData) {
          return cleanedData;
        }

        return { data: cleanedData };
      }),
    );
  }

  private transformDecimalObjects(obj: any): any {
    if (obj === null || obj === undefined) return obj;

    if (obj instanceof Date) {
      return obj.toISOString();
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.transformDecimalObjects(item));
    }

    if (typeof obj === 'object') {
      if (typeof obj.toFixed === 'function' && (obj.constructor.name === 'Decimal' || obj.d !== undefined)) {
        return Number(obj);
      }

      const newObj: any = {};
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          newObj[key] = this.transformDecimalObjects(obj[key]);
        }
      }
      return newObj;
    }

    return obj;
  }
}