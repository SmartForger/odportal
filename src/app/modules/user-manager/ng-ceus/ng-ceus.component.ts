import { Component, OnInit } from '@angular/core';
import { NgUmBaseApp } from '../ng-um-base-app';
import { SimpleTableColumn, SimpleTableIconType, SimpleTableActionEvent } from 'src/app/models/simple-table-column.model';

@Component({
  selector: 'ng-ceus',
  templateUrl: './ng-ceus.component.html',
  styleUrls: ['./ng-ceus.component.scss']
})
export class NgCeusComponent extends NgUmBaseApp {
  columns: SimpleTableColumn[] = [
    {
      label: "Activity",
      field: "activity",
      iconType: SimpleTableIconType.MatIcon
    },
    {
      label: "Hours",
      field: "hours"
    },
    {
      label: "Status",
      field: "status",
      iconType: SimpleTableIconType.Badge
    },
    {
      label: "",
      field: "",
      actions: [
        {
          action: "view",
          icon: "remove_red_eye",
          tooltip: "View CEU"
        }
      ]
    }
  ];

  data = [
    {
      activity: {
        icon: "av_timer",
        text: "Created Instructional Material",
        iconClass: "status-green"
      },
      hours: "10h",
      status: {
        color: "green",
        text: "Confirmed"
      }
    },
    {
      activity: {
        icon: "av_timer",
        text: "Created Instructional Material",
        iconClass: "status-blue"
      },
      hours: "1h",
      status: {
        color: "blue",
        text: "Submitted"
      }
    },
    {
      activity: {
        icon: "av_timer",
        text: "Attended Webinar",
        iconClass: "status-green"
      },
      hours: "2h",
      status: {
        color: "green",
        text: "Submitted"
      }
    }
  ];

  handleTableAction(ev: SimpleTableActionEvent) {
    console.log(ev);
  }
}
