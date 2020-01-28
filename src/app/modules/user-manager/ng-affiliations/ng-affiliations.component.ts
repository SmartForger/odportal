import { Component } from '@angular/core';
import { SimpleTableColumn, SimpleTableIconType, SimpleTableActionEvent } from 'src/app/models/simple-table-column.model';
import { NgUmBaseApp } from '../ng-um-base-app';

@Component({
  selector: 'ng-affiliations',
  templateUrl: './ng-affiliations.component.html',
  styleUrls: ['./ng-affiliations.component.scss']
})
export class NgAffiliationsComponent extends NgUmBaseApp {
  columns: SimpleTableColumn[] = [
    {
      label: "Organization",
      field: "organization",
      iconType: SimpleTableIconType.MatIcon,
      icon: "domain",
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
          tooltip: "Remove affiliation"
        }
      ]
    }
  ];

  data: any[] = [
    {
      organization: "Ultimate Knowledge Institute",
      role: "Senior UI Developer"
    },
    {
      organization: "ManTech",
      role: "Integration Specialist"
    }
  ];

  handleTableAction(ev: SimpleTableActionEvent) {
    console.log(ev);
  }
}
