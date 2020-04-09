import { Component, OnInit } from '@angular/core';
import { NgUmBaseApp } from '../ng-um-base-app';
import { SimpleTableColumn, SimpleTableActionEvent } from 'src/app/models/simple-table-column.model';

@Component({
  selector: 'ng-microapps',
  templateUrl: './ng-microapps.component.html',
  styleUrls: ['./ng-microapps.component.scss']
})
export class NgMicroappsComponent extends NgUmBaseApp {
  columns: SimpleTableColumn[] = [
    {
      label: "Microapp",
      field: "app",
      cellClass: "bold-500"
    },
    {
      label: "Organization",
      field: "organization"
    },
    {
      label: "Type",
      field: "type"
    },
    {
      label: "",
      field: "",
      actions: [
        {
          action: "view",
          icon: "remove_red_eye",
          tooltip: "View microapp"
        }
      ]
    }
  ];

  data = [
    {
      app: "Spotlite",
      organization: "Aptima",
      type: "Third Party"
    },
    {
      app: "Form Manager",
      organization: "Ultimate Knowledge Institute",
      type: "Third Party"
    }
  ];

  handleTableAction(ev: SimpleTableActionEvent) {
    console.log(ev);
  }
}
