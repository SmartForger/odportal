export enum SimpleTableIconType {
  Image = "Image",
  MatIcon = "MatIcon"
}

export interface SimpleTableAction {
  icon: string;
  action: string;
  tooltip?: string;
}

export interface SimpleTableColumn {
  field: string;
  label: string;
  headerClass?: string;
  cellClass?: string;
  iconType?: SimpleTableIconType;
  icon?: string;
  iconClass?: string;
  actions?: SimpleTableAction[];
}

export interface SimpleTableActionEvent {
  action: string;
  row: any;
}