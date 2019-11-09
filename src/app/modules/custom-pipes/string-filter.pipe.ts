import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stringFilter',
  pure: false
})
export class StringFilterPipe implements PipeTransform {

  transform(items: Array<Object>, fields: string, value: string): any {
    if (!items) {
      return [];
    }
    if (!fields || !value) {
      return items;
    }
    const keys: Array<string> = fields.split(',');
    return items.filter((item: Object) => {
      let match: boolean = false;
      for (let i: number = 0; i < keys.length; ++i) {
        if (item[keys[i]] && item[keys[i]].toLowerCase().includes(value.toLowerCase())) {
          match = true;
          break;
        }
      }
      return match;
    });
  }

}
