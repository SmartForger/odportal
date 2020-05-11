import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PlatformModalType } from 'src/app/models/platform-modal.model';
import { PresentationMonitor } from 'src/app/models/presentation-monitor';
import { UserDashboard } from 'src/app/models/user-dashboard.model';
import { PresentationService } from 'src/app/services/presentation.service';

@Component({
  selector: 'app-casting-modal',
  templateUrl: './casting-modal.component.html',
  styleUrls: ['./casting-modal.component.scss']
})
export class CastingModalComponent implements OnInit {
  paged: any[] = [];
  monitors: PresentationMonitor[] = [];

  constructor(
    private dlgRef: MatDialogRef<CastingModalComponent>,
    @Inject(MAT_DIALOG_DATA) public dashboards: UserDashboard[],
    public presentationSvc: PresentationService
  ) {
    this.dlgRef.addPanelClass("platform-modal");
    this.dlgRef.addPanelClass(PlatformModalType.PRIMARY);
  }

  ngOnInit() {
    this.paginate();
    this.presentationSvc.checkAvailability();
  }

  drop(dashboardId, monitorId) {
    if (monitorId) {
      // update dashboard in monitor
      this.presentationSvc.changeDashboard(dashboardId, monitorId);
    } else {
      const index = this.dashboards.findIndex(d => d.docId === dashboardId);
      this.presentationSvc.openExternalDisplay(index);
    }
  }

  getDashboardName(id) {
    const dashboard = this.dashboards.find(d => d.docId === id);
    return dashboard ? dashboard.title : "";
  }

  private paginate() {
    const c = Math.ceil(this.dashboards.length / 8);
    for (let i = 0; i < c; i ++) {
      this.paged.push(this.dashboards.slice(i * 8, (i + 1) * 8));
    }
  }
}
