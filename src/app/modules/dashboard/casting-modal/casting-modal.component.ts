import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PlatformModalType } from 'src/app/models/platform-modal.model';
import { PresentationMonitor } from 'src/app/models/presentation-monitor';

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
  paged: any[] = [];
  monitors: PresentationMonitor[] = [];

  constructor(
    private dlgRef: MatDialogRef<CastingModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.dlgRef.addPanelClass("platform-modal");
    this.dlgRef.addPanelClass(PlatformModalType.PRIMARY);
  }

  ngOnInit() {
    this.paginate();
  }

  drop(dashboardId, monitorId) {
    if (monitorId) {
      // update dashboard in monitor
    } else {
      // add new monitor
    }
  }

  getDashboardName(id) {
    const dashboard = this.dashboards.find(d => d.id === id);
    return dashboard ? dashboard.name : "";
  }

  private paginate() {
    const c = Math.ceil(this.dashboards.length / 8);
    for (let i = 0; i < c; i ++) {
      this.paged.push(this.dashboards.slice(i * 8, (i + 1) * 8));
    }
  }
}
