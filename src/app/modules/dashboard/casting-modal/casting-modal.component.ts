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

  currentPage = 0;

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
    this.monitors = this.presentationSvc.getConnectedMonitors();
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

  drop(dashboardId: string, monitorId?: string) {
    const index = this.dashboards.findIndex(d => d.docId === dashboardId);
    if (monitorId) {
      // update dashboard in monitor
      this.presentationSvc.changeDashboard(index, monitorId);
    } else {
      this.presentationSvc.openExternalDisplay(index);
    }
  }

  getDashboardName(id: number) {
    const dashboard = this.dashboards[id];
    return dashboard ? dashboard.title : "";
  }

  disconnect(monitor: PresentationMonitor) {
    this.presentationSvc.disconnect(monitor.id);
  }

  handlePageChange(page: number) {
    this.currentPage = page;
  }

  private paginate() {
    const c = Math.ceil(this.dashboards.length / 4);
    for (let i = 0; i < c; i ++) {
      this.paged.push(this.dashboards.slice(i * 4, (i + 1) * 4));
    }
  }
}
