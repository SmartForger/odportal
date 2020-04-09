import { Component, OnInit } from "@angular/core";
import { NgUmBaseApp } from "../ng-um-base-app";
import {
  SimpleTableActionEvent,
  SimpleTableColumn,
  SimpleTableIconType
} from "src/app/models/simple-table-column.model";

@Component({
  selector: "ng-jira-settings",
  templateUrl: "./ng-jira-settings.component.html",
  styleUrls: ["./ng-jira-settings.component.scss"]
})
export class NgJiraSettingsComponent extends NgUmBaseApp {
  groupNames: Array<string>;
  allGroupNames: Array<string>;

  appColumns: SimpleTableColumn[] = [
    {
      label: "Name",
      field: "name",
      cellClass: "bold-500",
      icon: "pages",
      iconType: SimpleTableIconType.MatIcon
    },
    {
      label: "",
      field: "",
      actions: [
        {
          action: "remove",
          icon: "cancel",
          tooltip: "Remove application"
        }
      ]
    }
  ];
  appData = [
    {
      name: {
        text: "Jira Service Desk"
      }
    }
  ];

  roleColumns: SimpleTableColumn[] = [
    {
      label: "Name",
      field: "name",
      cellClass: "bold-500",
      icon: "group_work",
      iconType: SimpleTableIconType.MatIcon
    },
    {
      label: "Administrators",
      field: "admin",
      cellClass: "text-center",
      headerClass: "text-center",
      iconType: SimpleTableIconType.MatIcon
    },
    {
      label: "Developers",
      field: "developer",
      cellClass: "text-center",
      headerClass: "text-center",
      iconType: SimpleTableIconType.MatIcon
    },
    {
      label: "Service Desk",
      field: "service",
      cellClass: "text-center",
      headerClass: "text-center",
      iconType: SimpleTableIconType.MatIcon
    }
  ];
  roleData = [
    {
      name: {
        text: "PCTE Registration"
      },
      admin: {
        icon: "check_circle",
        iconClass: "avatar status-green"
      },
      developer: {
        icon: "check_circle",
        iconClass: "avatar status-green"
      },
      service: {
        icon: "check_circle",
        iconClass: "avatar status-green"
      }
    },
    {
      name: {
        text: "Valhalla"
      },
      admin: {
        icon: "check_circle",
        iconClass: "avatar status-green"
      },
      developer: {
        icon: "cancel",
        iconClass: "avatar status-red"
      },
      service: {
        icon: "cancel",
        iconClass: "avatar status-red"
      }
    }
  ]

  constructor() {
    super();

    this.groupNames = [];
    this.allGroupNames = [
      "jira-servicedesk-users",
      "jira-administrators",
      "jira-valhalla-event"
    ];
  }

  handleAppTableAction(ev: SimpleTableActionEvent) {
    console.log(ev);
  }

  handleRoleTableAction(ev: SimpleTableActionEvent) {
    console.log(ev);
  }
}
