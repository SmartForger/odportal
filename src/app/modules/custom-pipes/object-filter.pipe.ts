import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'objectFilter'
})
export class ObjectFilterPipe implements PipeTransform {

  transform(items: Array<Object>, field: any, value: any): any {
    if (!items) {
      return [];
    }
    if (!field || !value) {
      return items;
    }
    return items.filter((item: Object) => {
      return item[field] === value;
    });
  }

}
