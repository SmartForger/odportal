import { Component } from "@angular/core";
import { NgUmBaseApp } from "../ng-um-base-app";
import {
  SimpleTableColumn,
  SimpleTableIconType,
  SimpleTableRow
} from "src/app/models/simple-table-column.model";

@Component({
  selector: "ng-simspace",
  templateUrl: "./ng-simspace.component.html",
  styleUrls: ["./ng-simspace.component.scss"]
})
export class NgSimspaceComponent extends NgUmBaseApp {
  columns: SimpleTableColumn[] = [
    {
      label: "Classses",
      field: "classes",
      iconType: SimpleTableIconType.MatIcon,
      icon: "ballot",
      cellClass: "bold-500"
    },
    {
      label: "Status",
      field: "status",
      iconType: SimpleTableIconType.Badge
    },
    {
      label: "Score",
      field: "score",
      iconType: SimpleTableIconType.ProgressCircle
    },
    {
      label: "",
      field: "",
      actions: [
        {
          action: "view",
          icon: "remove_red_eye",
          tooltip: "View class"
        }
      ]
    }
  ];

  data: SimpleTableRow[] = [
    {
      classes: {
        text: "UKI Forensic Analysis 1",
        iconClass: "status-red"
      },
      status: {
        text: "Failed",
        color: "red"
      },
      score: {
        progress: 25,
        color: "red"
      }
    },
    {
      classes: {
        text: "CompTIA Security+ (v2)",
        iconClass: "status-blue"
      },
      status: {
        text: "In progress",
        color: "blue"
      },
      score: {
        progress: 101,
        color: "blue"
      }
    },
    {
      classes: {
        text: "Metaspolit Pro - Intermediate",
        iconClass: "status-green"
      },
      status: {
        text: "Passed",
        color: "green"
      },
      score: {
        progress: 100,
        color: "green"
      }
    }
  ];
}
