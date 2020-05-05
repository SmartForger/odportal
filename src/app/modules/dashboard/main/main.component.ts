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
import { Subscription, Observable } from 'rxjs';
import { DashboardTemplateService } from 'src/app/services/dashboard-template.service';
import * as uuid from 'uuid';
import { WidgetModalService } from 'src/app/services/widget-modal.service';
import { PresentationService } from 'src/app/services/presentation.service';
import { UserSettingsService } from 'src/app/services/user-settings.service';

declare var $: any;

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {
  
  addWidgetSub: Subscription;
  dashIndex: number;
  templateSub: Subscription;
  editMode: boolean;
  tempDashboard: UserDashboard;
  userDashboards: Array<UserDashboard>;
  presentationSub: Subscription;

  @ViewChild('dashboardGridsterComponent') dashboardGridsterComponent: DashboardGridsterComponent;

  constructor(
    private authSvc: AuthService,
    private dashSvc: DashboardService,
    private dashTemplateSvc: DashboardTemplateService,
    private widgetModalSvc: WidgetModalService,
    private presentationSvc: PresentationService,
    private userSettingsSvc: UserSettingsService
  ) { 
    this.userDashboards = [UserDashboard.createDefaultDashboard(this.authSvc.getUserId())];
    this.dashIndex = 0;
    this.tempDashboard = UserDashboard.createDefaultDashboard(this.authSvc.getUserId());
    this.editMode = false;
  }

  ngOnInit() {
    this.dashSvc.activeDashboardIsInEditMode = false;
    this.dashSvc.listDashboards().subscribe(
      (dashboards: Array<UserDashboard>) => {
        if (dashboards.length) {
          this.userDashboards = dashboards;
        }
        else {
          this.createDefaultDashboard(this.userDashboards[0]);
        }
        this.fetchTemplateInstances().subscribe((templateChange: boolean) => {
          if(!templateChange){
            this.setActiveDashboardIndex();
            this.setDashboard(this.dashIndex);
          }
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

    this.presentationSub = this.presentationSvc.onDashboardChange
      .subscribe(dashboardIndex => {
        this.setDashboard(dashboardIndex);
        this.userSettingsSvc.setShowNavigation(false);
      });
  }

  ngOnDestroy(){
    this.addWidgetSub.unsubscribe();
    this.presentationSub.unsubscribe();
    if(this.templateSub){this.templateSub.unsubscribe();}
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
    this.dashSvc.activeDashboardIsInEditMode = true;
    if(!this.editMode){
      this.tempDashboard = Cloner.cloneObject<UserDashboard>(this.userDashboards[this.dashIndex]);
      this.editMode = true;
    }
  }

  leaveEditMode(saveChanges: boolean){
    this.dashSvc.activeDashboardIsInEditMode = false;
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

  openWidgetModal() {
    this.enterEditMode();
    this.widgetModalSvc.show();
  }

  get currentDashboard() {
    return this.userDashboards[this.dashIndex];
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

  private removeTemplateDashboards(): number{
    let temp = new Array<UserDashboard>();
    let templateCount = 0;

    this.userDashboards.forEach((dash: UserDashboard, index: number) => {
      if(!dash.isTemplate){
        temp.push(dash);
      }
      else{
        templateCount++;
      }
    });

    this.userDashboards = temp;

    return templateCount;
  }

  private fetchTemplateInstances(): Observable<boolean>{
    return new Observable((observer) => {
      if(!this.templateSub){
        this.templateSub = this.dashTemplateSvc.observeTemplateInstances().subscribe((instances: Array<UserDashboard>) => {
          let oldTemplateCount = this.removeTemplateDashboards();

          if(instances.length > 0){
            if(this.userDashboards.length === 1 && this.userDashboards[0].gridItems.length === 0 && this.userDashboards[0].title === 'New Dashboard'){
              this.dashSvc.activeDashboardId = instances[0].docId;
              this.dashSvc.activeDashboardIsTemplate = true;
            }
            else if(!this.dashSvc.activeDashboardIsTemplate){
              this.setActiveDashboardIndex();
              this.dashIndex = this.dashIndex + instances.length - oldTemplateCount;
            }

            this.userDashboards = instances.concat(this.userDashboards);

            if(this.dashSvc.activeDashboardIsTemplate){
              this.setActiveDashboardIndex();
            }
            this.setDashboard(this.dashIndex);
          }

          observer.next(instances.length > 0 || oldTemplateCount > 0);
          observer.complete();
        });
      }
      else{
        observer.next(false);
        observer.complete();
      }
    });

  }
  
}
