import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PlatformModalType } from 'src/app/models/platform-modal.model';
import { PresentationMonitor } from 'src/app/models/presentation-monitor';
import { UserDashboard } from 'src/app/models/user-dashboard.model';
import { PresentationService } from 'src/app/services/presentation.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-casting-modal',
  templateUrl: './casting-modal.component.html',
  styleUrls: ['./casting-modal.component.scss']
})
export class CastingModalComponent implements OnInit {
  paged: any[] = [];
  monitors: PresentationMonitor[] = [];
  monitorAddedSub: Subscription;
  monitorRemovedSub: Subscription;
  monitorUpdatedSub: Subscription;

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
    this.monitorAddedSub = this.presentationSvc.onMonitorAdded.subscribe(
      (monitor: PresentationMonitor) => {
        this.monitors = [...this.monitors, monitor];
      }
    );
    this.monitorUpdatedSub = this.presentationSvc.onMonitorUpdated.subscribe(
      (monitor: PresentationMonitor) => {
        this.monitors = this.monitors.map(m => m.id == monitor.id ? monitor : m);
      }
    );
    this.monitorRemovedSub = this.presentationSvc.onMonitorRemoved.subscribe(
      (monitor: PresentationMonitor) => {
        this.monitors = this.monitors.filter(m => m.id !== monitor.id);
      }
    );
  }

  ngOnDestroy() {
    this.monitorAddedSub.unsubscribe();
    this.monitorUpdatedSub.unsubscribe();
    this.monitorRemovedSub.unsubscribe();
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

  getDashboardName(id: number) {
    const dashboard = this.dashboards[id];
    return dashboard ? dashboard.title : "";
  }

  private paginate() {
    const c = Math.ceil(this.dashboards.length / 8);
    for (let i = 0; i < c; i ++) {
      this.paged.push(this.dashboards.slice(i * 8, (i + 1) * 8));
    }
  }
}
