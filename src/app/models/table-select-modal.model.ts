import { Observable } from "rxjs";

export interface TableSelectModalModel<T> {
  buttonLabel?: string;
  columns: string[];
  data: any[];
  filterFunc: (search: string, data: Array<T>) => Array<T>;
  query: (first: number, max: number) => Observable<Array<T>>
  searchPlaceholder?: string;
  title: string;
}
