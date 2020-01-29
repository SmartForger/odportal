import { Component } from '@angular/core';
import { NgUmBaseApp } from '../ng-um-base-app';
import { SimpleTableColumn, SimpleTableIconType, SimpleTableActionEvent } from 'src/app/models/simple-table-column.model';

@Component({
  selector: 'ng-security-access',
  templateUrl: './ng-security-access.component.html',
  styleUrls: ['./ng-security-access.component.scss']
})
export class NgSecurityAccessComponent extends NgUmBaseApp {
  columns: SimpleTableColumn[] = [
    {
      label: "IP Address",
      field: "ipAddress",
      iconType: SimpleTableIconType.MatIcon,
      icon: "bolt",
      iconClass: "icon-green",
      cellClass: "bold-500"
    },
    {
      label: "Geolocation",
      field: "location"
    },
    {
      label: "",
      field: "",
      actions: [
        {
          action: "terminate",
          icon: "offline_bolt",
          tooltip: "Terminate session"
        }
      ]
    }
  ];

  data: any[] = [
    {
      ipAddress: {
        text: "192.168.5.42"
      },
      location: "Orlando, Florida, US"
    },
    {
      ipAddress: {
        text: "50.54.30.255"
      },
      location: "Cleveland, Ohio, US"
    }
  ];

  handleTableAction(ev: SimpleTableActionEvent) {
    console.log(ev);
  }
}
