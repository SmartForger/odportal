import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'objectProp'
})
export class ObjectPropPipe implements PipeTransform {

  transform(value: any, prop?: string, defaultValue?: string): string {
    try {
        const msgObj = JSON.parse(value);
        return msgObj[prop] || defaultValue;
    } catch (err) {
        return defaultValue;
    }
  }

}
