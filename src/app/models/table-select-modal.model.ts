export interface TableSelectModalModel {
  title: string;
  searchPlaceholder?: string;
  buttonLabel?: string;
  columns: string[];
  data: any[];
  filterFunc: (search: string, item: any) => boolean;
}
