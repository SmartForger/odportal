/**
 * @description Handles data flow into, between, and out of the dashboard components.
 * @author James Marcu
 */

import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { App } from '../../../models/app.model';
import { Widget } from '../../../models/widget.model';
import { AuthService } from '../../../services/auth.service';
import { DashboardService } from '../../../services/dashboard.service';
import { WidgetGridItem } from 'src/app/models/widget-grid-item.model';
import { UserDashboard } from 'src/app/models/user-dashboard.model';
import { DashboardGridsterComponent } from '../dashboard-gridster/dashboard-gridster.component';
import { Cloner } from '../../../util/cloner';
import { Subscription, Subscribable, forkJoin, Observable } from 'rxjs';
import * as uuid from 'uuid';
import { SimspaceHardcodeService, SSMembership } from 'src/app/services/simspace-hardcode.service';
import { DashboardTemplateService } from 'src/app/services/dashboard-template.service';

declare var $: any;

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {
  
  addWidgetSub: Subscription;
  dashIndex: number;
  eventIdSub: Subscription;
  editMode: boolean;
  tempDashboard: UserDashboard;
  userDashboards: Array<UserDashboard>;

  @ViewChild('dashboardGridsterComponent') dashboardGridsterComponent: DashboardGridsterComponent;

  constructor(
    private authSvc: AuthService,
    private dashSvc: DashboardService,
    private dashTemplateSvc: DashboardTemplateService,
    private ssHardSvc: SimspaceHardcodeService
  ) { 
    this.userDashboards = [UserDashboard.createDefaultDashboard(this.authSvc.getUserId())];
    this.dashIndex = 0;
    this.tempDashboard = UserDashboard.createDefaultDashboard(this.authSvc.getUserId());
    this.editMode = false;
  }

  ngOnInit() {
    this.dashSvc.listDashboards().subscribe(
      (dashboards: Array<UserDashboard>) => {
        if (dashboards.length) {
          this.userDashboards = dashboards;
        }
        else {
          this.createDefaultDashboard(this.userDashboards[0]);
        }
        this.ssEventHardcode().subscribe(() => {
          this.setActiveDashboardIndex();
        });
      },
      (err: any) => {console.log(err);}
    );

    this.addWidgetSub = this.dashSvc.observeAddWidget().subscribe(
      (value: {app: App, widget: Widget}) => {
        this.addWidget(value.app, value.widget);
      },
      (err: any) => {console.log(err);}
    );
  }

  ngOnDestroy(){
    this.addWidgetSub.unsubscribe();
    if(this.eventIdSub){this.eventIdSub.unsubscribe();}
  }

  private createDefaultDashboard(dashboard: UserDashboard): void {
    this.dashSvc.addDashboard(dashboard).subscribe(
      (newDashboard: UserDashboard) => {
        this.userDashboards[0] = newDashboard;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  enterEditMode(){
    if(!this.editMode){
      this.tempDashboard = Cloner.cloneObject<UserDashboard>(this.userDashboards[this.dashIndex]);
      this.editMode = true;
    }
  }

  leaveEditMode(saveChanges: boolean){
    if(this.editMode){
      if(saveChanges){
        if(this.userDashboards[this.dashIndex].isTemplate){
            this.dashTemplateSvc.updateInstance(this.userDashboards[this.dashIndex]).subscribe((dashboard) => {
                this.setDashboard(this.dashIndex);
                this.editMode = false;
            });
        }
        else{
            this.dashSvc.updateDashboard(this.userDashboards[this.dashIndex]).subscribe((dashboard) => {
                this.setDashboard(this.dashIndex);
                this.editMode = false;
            });
        }
      }
      else{
        this.userDashboards[this.dashIndex] = this.tempDashboard;
        this.setDashboard(this.dashIndex);
        this.editMode = false;
      }

    }
  }

  setDashboard(dashIndex: number){
    if(dashIndex >= 0 && dashIndex < this.userDashboards.length){
      this.dashIndex = dashIndex;

      if(this.userDashboards[this.dashIndex].docId){
        this.dashSvc.activeDashboardId = this.userDashboards[this.dashIndex].docId;
        this.dashSvc.activeDashboardIsTemplate = this.userDashboards[this.dashIndex].isTemplate;
      }
    }
  }

  addWidget(app: App, widget: Widget): void{
    this.enterEditMode();
    let gridsterItem = this.dashboardGridsterComponent.getGridsterItem();
    let gridItem: WidgetGridItem = {
      gridId: uuid.v4(),
      gridsterItem: gridsterItem,
      parentAppId: app.docId,
      widgetId: widget.docId
    }

    if(widget.gridsterDefault){
      gridItem.gridsterItem = widget.gridsterDefault;
    }

    this.userDashboards[this.dashIndex].gridItems.push(gridItem);

    this.setDashboard(this.dashIndex);
    this.dashboardGridsterComponent.dashboard = this.userDashboards[this.dashIndex];
  }

  private setActiveDashboardIndex(): void{
    this.dashIndex = this.userDashboards.findIndex((dashboard) => dashboard.docId === this.dashSvc.activeDashboardId);
    if(this.dashIndex === -1){
      this.dashIndex = this.userDashboards.findIndex((dashboard) => dashboard.default);

      if(this.dashIndex === -1){
        this.dashIndex = 0; 
        this.userDashboards[0].default = true;
        this.dashSvc.updateDashboard(this.userDashboards[0]).subscribe();
      }
    }
  }

  private removeTemplateDashboards(): void{
    let activeDashIsTemplate = this.userDashboards[this.dashIndex].isTemplate;
    let temp = new Array<UserDashboard>();
    let currentIndex = 0;
    let defaultFound = false;
    let defaultIndex = 0;
    let runningIndex = 0;

    this.userDashboards.forEach((dash: UserDashboard, index: number) => {
      if(!dash.isTemplate){
        temp.push(dash);
        if(!defaultFound && dash.default){
          defaultFound = true;
          defaultIndex = runningIndex;
        }
        if(this.dashIndex === index){
          currentIndex = runningIndex;
        }
        runningIndex++;
      }
      this.userDashboards = temp;
      if(activeDashIsTemplate){
        this.setDashboard(defaultIndex);
      }
      else{
        this.setDashboard(currentIndex);
      }
    });
  }

  private ssEventHardcode(): Observable<boolean>{
    window.postMessage({ type: "GET_CURRENT_EVENT", data: { eventId: "some-event-id" } }, 'http://localhost:4200');

    return new Observable((observer) => {
      if(!this.eventIdSub){
        this.eventIdSub = this.ssHardSvc.observeEventId().subscribe((eventId: string) => {
          this.removeTemplateDashboards();
          
          if(eventId){
            this.dashTemplateSvc.listUserInstancesByEvent(eventId).subscribe((instances: Array<UserDashboard>) => {
              this.userDashboards = instances.concat(this.userDashboards);
              if(this.userDashboards.length === 1 && this.userDashboards[0].gridItems.length === 0 && this.userDashboards[0].title === 'New Dashboard'){
                this.dashIndex = 0;
                this.dashSvc.activeDashboardIsTemplate = true;
              }
              else{
                this.dashIndex = this.dashIndex + instances.length;
              }
              this.setActiveDashboardIndex();
              observer.next(instances.length > 0);
              observer.complete();
            });
          }
        });
        if(!this.ssHardSvc.hasEventId()){
          observer.next(false);
          observer.complete();
        }
      }
      else{
        observer.next(false);
        observer.complete();
      }
    });

  }
  
}
