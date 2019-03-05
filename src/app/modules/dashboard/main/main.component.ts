import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { AppsService } from '../../../services/apps.service';
import { App } from '../../../models/app.model';
import { Widget } from '../../../models/widget.model';
import { AuthService } from '../../../services/auth.service';
import { DashboardService } from '../../../services/dashboard.service';
import { GridsterConfig, GridsterItem } from 'angular-gridster2';
import { WidgetGridItem } from 'src/app/models/widget-grid-item.model';
import { UserDashboard } from 'src/app/models/user-dashboard.model';
import { ModalComponent } from '../../display-elements/modal/modal.component';
import { DashboardDetailsModalComponent } from '../dashboard-details-modal/dashboard-details-modal.component';

declare var $: any;

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {
  apps: Array<App>;
  options: GridsterConfig;
  userDashboards: Array<UserDashboard>;
  dashIndex: number;
  tempDashboard: UserDashboard;
  inEditMode: boolean;
  widgetCardClass: string;
  indexToDelete: number;
  dashModels: Array<{app: App, widget: Widget, errorOccurred: boolean}>

  @ViewChild('confirmWidgetDeletionModal') private widgetDeletionModal: ModalComponent;
  @ViewChild('editDashboardDetailsModal') private dashDetailsModal: DashboardDetailsModalComponent;

  constructor(private dashSvc: DashboardService, private appsSvc: AppsService, private authSvc: AuthService) { 
    this.apps = [];
    this.userDashboards = [{
      userId:'', 
      gridItems:[]
    }];
    this.dashIndex = 0;
    this.tempDashboard = {
      userId: '',
      gridItems: []
    }
    this.options = {
      gridType: 'fit',
      minCols: 8,
      minRows: 8,
      defaultItemCols: 2,
      defaultItemRows: 2,
      displayGrid: 'none',
      margin: 25,
      resizable: {
        enabled: false
      },
      draggable: {
        enabled: false
      }
    };
    this.inEditMode = false;
    this.widgetCardClass = 'gridster-card-view-mode';
    this.dashModels = [];
  }

  ngOnInit() {
    this.dashSvc.listDashboards().subscribe(
      (dashboards: Array<UserDashboard>) => {
        this.userDashboards = dashboards;
      },
      (err: any) => {console.log(err);}
    );

    this.appsSvc.appStoreSub.subscribe(
      (apps: Array<App>) => {
        apps.forEach(
          (app) => this.apps.push(app)
        );
        this.initHardcode();
        this.loadDashModels();
      },
      (err: any) => {console.log(err);}
    );

    this.dashSvc.addWidgetSubject.subscribe(
      (value: {app: App, widget: Widget}) => {
        this.addWidget(value.app, value.widget);
      },
      (err: any) => {console.log(err);}
    );
  }

  ngOnDestroy() {
    this.appsSvc.appStoreSub.unsubscribe();
  }

  setEditMode(editMode: boolean){
    if(editMode){
      if(!this.inEditMode){
        this.deepCopyDashboard(this.userDashboards[this.dashIndex], this.tempDashboard);
      }

      this.inEditMode = true;
      this.options.displayGrid = 'always';
      this.options.draggable.enabled = true;
      this.options.resizable.enabled = true;
      this.widgetCardClass = '';
    }
    else{
      this.inEditMode = false;
      this.options.displayGrid = 'none';
      this.options.draggable.enabled = false;
      this.options.resizable.enabled = false;
      this.widgetCardClass = 'gridster-card-view-mode';
    }
    this.options.api.optionsChanged();
  }

  addWidget(app: App, widget: Widget): void{
    this.setEditMode(true);

    let gridItem: WidgetGridItem = {
      parentAppId: app.docId,
      widgetId: widget.docId,
      gridsterItem: {
        cols: 2,
        rows: 2,
        x: 0,
        y: 0
      }
    }

    if(widget.gridsterDefault){
      gridItem.gridsterItem = widget.gridsterDefault;
    }

    this.userDashboards[this.dashIndex].gridItems.push(gridItem);

    this.dashModels.push({app: app, widget: widget, errorOccurred: false});
  }
  
  confirmDelete(widgetIndex: number): void{
    this.indexToDelete = widgetIndex;
    this.widgetDeletionModal.show = true;
  }

  removeWidget(buttonTitle: string): void{
    this.widgetDeletionModal.show = false;
    if(buttonTitle === 'confirm'){
      this.userDashboards[this.dashIndex].gridItems.splice(this.indexToDelete, 1);
      this.dashModels.splice(this.indexToDelete, 1);
    }
  }

  showDashboardDetailsModal(show: boolean){
    this.dashDetailsModal.show = show;
  }

  setDashboardDetails(input: any){
    this.userDashboards[this.dashIndex].title = input.title;
    this.userDashboards[this.dashIndex].description = input.description;
  }

  revertChanges(): void{
    this.deepCopyDashboard(this.tempDashboard, this.userDashboards[this.dashIndex]);
    this.loadDashModels();
  }

  saveDashboard(): void{
    this.dashSvc.updateDashboard(this.userDashboards[this.dashIndex]).subscribe();
  }

  private deepCopyDashboard(copyFrom: UserDashboard, copyTo: UserDashboard){
    copyTo.userId = copyFrom.userId;
    copyTo.gridItems = [];

    if(copyFrom.title){
      copyTo.title = copyFrom.title;
    }

    if(copyFrom.description){
      copyTo.description = copyFrom.description;
    }

    for(let i = 0; i < copyFrom.gridItems.length; i++){
      let tempGridsterItem: GridsterItem = {
        cols: copyFrom.gridItems[i].gridsterItem.cols,
        rows: copyFrom.gridItems[i].gridsterItem.rows,
        x: copyFrom.gridItems[i].gridsterItem.x,
        y: copyFrom.gridItems[i].gridsterItem.y
      }

      let tempWGI: WidgetGridItem = {
        parentAppId: copyFrom.gridItems[i].parentAppId,
        widgetId: copyFrom.gridItems[i].widgetId,
        gridsterItem: tempGridsterItem
      }

      copyTo.gridItems.push(tempWGI);
    }
  }

  private loadDashModels(): void{
    this.dashModels = [];

    for(let gridItemIndex = 0; gridItemIndex < this.userDashboards[this.dashIndex].gridItems.length; gridItemIndex++){
      let errorOccurred: boolean = false;

      let parentAppModel: App = this.apps.find(
        (app) => app.docId === this.userDashboards[this.dashIndex].gridItems[gridItemIndex].parentAppId
      );

      if(parentAppModel){
        if(parentAppModel.widgets){
          let widgetModel = parentAppModel.widgets.find(
            (widget) => widget.docId === this.userDashboards[this.dashIndex].gridItems[gridItemIndex].widgetId
          );

          if(widgetModel){
            this.dashModels.push({
              app: parentAppModel,
              widget: widgetModel,
              errorOccurred: false
            });
          }
          else{
            errorOccurred = true;
            console.error("Error: Parent app " + parentAppModel.appTitle + " does not contain the widget with id " + this.userDashboards[this.dashIndex].gridItems[gridItemIndex].widgetId + ".");
          }
        }
        else{
          errorOccurred = true;
          console.error("Error: Parent app " + parentAppModel.appTitle + " does not contain any widgets. Unable to load widget with id " + this.userDashboards[this.dashIndex].gridItems[gridItemIndex].widgetId + ".");
        }
      }
      else{
        errorOccurred = true;
        console.error("Error: Unable to find parent app with id " + this.userDashboards[this.dashIndex].gridItems[gridItemIndex].parentAppId + " for widget with id " + this.userDashboards[this.dashIndex].gridItems[gridItemIndex].widgetId + ".");
      }

      if(errorOccurred){
        this.dashModels.push({app: null, widget: null, errorOccurred: true});
      }
    }
  }

  private initHardcode(): void{
    this.apps.push({
      docId: 'hwa-id',
      appTitle: 'Hardcoded Widgets App',
      enabled: true,
      native: true,
      clientId: '123',
      clientName: 'Test Client',
      widgets: []
    });

    let index: number = this.apps.length - 1;

    this.apps[index].widgets.push({
      docId: 'auc-id',
      widgetTitle: 'Active User Count',
      widgetBootstrap: '',
      widgetTag: 'active-user-count-widget',
      icon: 'icon-active-users'
    });

    this.apps[index].widgets.push({
      docId: 'puc-id',
      widgetTitle: 'Pending User Count',
      widgetBootstrap: '',
      widgetTag: 'pending-user-count-widget',
      icon: 'icon-pending-users'
    });

    this.apps[index].widgets.push({
      docId: 'ucavp-id',
      widgetTitle: 'User Chart (Active vs Pending)',
      widgetBootstrap: '',
      widgetTag: 'user-chart-widget',
      icon: 'icon-users'
    });

    this.apps[index].widgets.push({
      docId: 'uc-id',
      widgetTitle: 'User Count',
      widgetBootstrap: '',
      widgetTag: 'user-count-widget',
      icon: 'icon-users'
    });
  }

  
}
