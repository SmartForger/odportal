import { Component } from '@angular/core';
import { NgUmBaseApp } from '../ng-um-base-app';
import { SimpleTableColumn, SimpleTableActionEvent } from 'src/app/models/simple-table-column.model';

@Component({
  selector: 'ng-mattermost',
  templateUrl: './ng-mattermost.component.html',
  styleUrls: ['./ng-mattermost.component.scss']
})
export class NgMattermostComponent extends NgUmBaseApp {
  columns: SimpleTableColumn[] = [
    {
      label: "Team",
      field: "team",
      cellClass: "bold-500"
    },
    {
      label: "Role",
      field: "role"
    },
    {
      label: "",
      field: "",
      actions: [
        {
          action: "remove",
          icon: "cancel",
          tooltip: "Remove from team"
        }
      ]
    }
  ];

  data = [
    {
      team: "Valhalla Event",
      role: "System Admin"
    },
    {
      team: "Form Manager",
      role: "Team Member"
    }
  ];

  handleTableAction(ev: SimpleTableActionEvent) {
    console.log(ev);
  }
}
