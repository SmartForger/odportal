import { Component } from '@angular/core';
import { NgUmBaseApp } from '../ng-um-base-app';
import { SimpleTableColumn, SimpleTableIconType, SimpleTableActionEvent } from 'src/app/models/simple-table-column.model';

@Component({
  selector: 'ng-custom-attributes',
  templateUrl: './ng-custom-attributes.component.html',
  styleUrls: ['./ng-custom-attributes.component.scss']
})
export class NgCustomAttributesComponent extends NgUmBaseApp {
  columns: SimpleTableColumn[] = [
    {
      label: "Key",
      field: "key",
      cellClass: "bold-500"
    },
    {
      label: "Value",
      field: "value"
    },
    {
      label: "Added",
      field: "added"
    },
    {
      label: "",
      field: "",
      actions: [
        {
          action: "remove",
          icon: "cancel",
          tooltip: "Delete attribute"
        }
      ]
    }
  ];

  data = [
    {
      key: "CALC_AUTH",
      value: "Yes",
      added: "09/01/2019 at 02:31PM"
    },
    {
      key: "CYBER_TRAINING",
      value: "Yes",
      added: "09/01/2019 at 02:32PM"
    }
  ];

  handleTableAction(ev: SimpleTableActionEvent) {
    console.log(ev);
  }
}
