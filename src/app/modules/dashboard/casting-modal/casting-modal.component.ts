import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PlatformModalType } from 'src/app/models/platform-modal.model';

@Component({
  selector: 'app-casting-modal',
  templateUrl: './casting-modal.component.html',
  styleUrls: ['./casting-modal.component.scss']
})
export class CastingModalComponent implements OnInit {
  dashboards = [
    {
      id: "1",
      name: "Dashboard 1"
    },
    {
      id: "2",
      name: "Dashboard 2"
    },
    {
      id: "3",
      name: "Dashboard 3"
    },
    {
      id: "4",
      name: "Dashboard 4"
    },
    {
      id: "5",
      name: "Dashboard 5"
    },
    {
      id: "6",
      name: "Dashboard 6"
    },
    {
      id: "7",
      name: "Dashboard 7"
    },
    {
      id: "8",
      name: "Dashboard 8"
    },
    {
      id: "9",
      name: "Dashboard 9"
    },
    {
      id: "10",
      name: "Dashboard 10"
    },
    {
      id: "11",
      name: "Dashboard 11"
    },
    {
      id: "12",
      name: "Dashboard 12"
    }
  ];
  monitors = [
    {
      id: "1",
      name: "Monitor 1",
      dashboard: "2"
    },
    {
      id: "2",
      name: "Monitor 2",
      dashboard: "5"
    }
  ];
  pagedDashboards = [];
  page: number = 0;

  constructor(
    private dlgRef: MatDialogRef<CastingModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cdr: ChangeDetectorRef
  ) {
    this.dlgRef.addPanelClass("platform-modal");
    this.dlgRef.addPanelClass(PlatformModalType.PRIMARY);
  }

  ngOnInit() {
    this.paginate();
  }

  drop(dashboardId, monitorId) {
    if (monitorId) {
      const monitor = this.monitors.find(m => m.id === monitorId);
      monitor.dashboard = dashboardId;
    } else {
      let lastId = this.monitors.length > 0 ? +this.monitors[this.monitors.length - 1].id : 0;
      this.monitors.push({
        id: `${lastId + 1}`,
        name: `Monitor ${lastId + 1}`,
        dashboard: dashboardId
      });
    }
  }

  getDashboardName(id) {
    const dashboard = this.dashboards.find(d => d.id === id);
    return dashboard ? dashboard.name : "";
  }

  private paginate() {
    this.pagedDashboards = this.dashboards.slice(this.page * 8, (this.page + 1) * 8);
  }
}
