import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { GridsterConfig, GridsterItem, GridsterItemComponentInterface } from 'angular-gridster2';
import { App } from '../../../models/app.model';
import { UserDashboard } from 'src/app/models/user-dashboard.model';
import { AppsService } from 'src/app/services/apps.service';
import { WidgetRendererFormat } from '../../../models/widget-renderer-format.model';
import { DashboardService } from 'src/app/services/dashboard.service';
import { Cloner } from '../../../util/cloner';
import { WidgetWindowsService } from 'src/app/services/widget-windows.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ConfirmModalComponent } from '../../display-elements/confirm-modal/confirm-modal.component';
import {WidgetGridItem} from '../../../models/widget-grid-item.model';
import {AppWithWidget} from '../../../models/app-with-widget.model';

@Component({
  selector: 'app-dashboard-gridster',
  templateUrl: './dashboard-gridster.component.html',
  styleUrls: ['./dashboard-gridster.component.scss']
})
export class DashboardGridsterComponent implements OnInit, OnDestroy {
  private _dashboard: UserDashboard;
  @Input('dashboard')
  get dashboard(): UserDashboard {
    return this._dashboard;
  }
  set dashboard(dashboard: UserDashboard){
    this._dashboard = dashboard;
    if(this.apps.length > 0){
      this.instantiateModels();
    }
    this.resize.next();
  }

  private _editMode: boolean;
  @Input('editMode')
  get editMode(): boolean {
    return this._editMode;
  }
  set editMode(editMode: boolean) {
    if(editMode != this._editMode){
      this.toggleEditMode();
    }
  }

  private appCacheSub: Subscription;

  apps: Array<App>;
  models: Array<AppWithWidget>
  options: GridsterConfig;
  indexToDelete: number;
  rendererFormat: WidgetRendererFormat;
  resize: Subject<void>;

  maximize: boolean;
  maximizeIndex: number;
  maximizeRendererFormat: WidgetRendererFormat;

  constructor(private appsSvc: AppsService, private dashSvc: DashboardService, private widgetWindowsSvc: WidgetWindowsService, private dialog: MatDialog) { 
    this._editMode = false;
    this.resize = new Subject<void>();

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
      },
      itemResizeCallback: (item: GridsterItem, gridsterItemComponent: GridsterItemComponentInterface) => {
        this.resize.next();
      }
    };

    this.apps = new Array<App>();
    this.models = new Array<AppWithWidget>();

    this.rendererFormat = {
      cardClass: 'gridster-card-view-mode', widgetBodyClass: '',
      leftBtn: {class: "", icon: "crop_square", disabled: false},
      middleBtn: {class: "", icon: "filter_none", disabled: false},
      rightBtn: {class: "disabled", icon: "clear", disabled: true}
    };

    this.maximizeRendererFormat = {
      cardClass: 'gridster-card-view-mode', widgetBodyClass: '',
      leftBtn: {class: "disabled", icon: "crop_square", disabled: true},
      middleBtn: {class: "", icon: "filter_none", disabled: false},
      rightBtn: {class: "", icon: "clear", disabled: false}
    }
  }

  ngOnInit() {
    this.subscribeToAppCache();
  }

  ngOnDestroy() {
    this.appCacheSub.unsubscribe();
  }

  private subscribeToAppCache(): void {
    this.appCacheSub = this.appsSvc.observeLocalAppCache().subscribe(
      (apps: Array<App>) => {
        this.apps = apps;
        if (this.models.length) {
          this.updateModels();
        }
        else {
          this.instantiateModels();
        }
      }
    );
  }

  toggleEditMode(){
    if(this._editMode){
      this._editMode = false;
      this.options.displayGrid = 'none';
      this.options.draggable.enabled = false;
      this.options.resizable.enabled = false;
      this.rendererFormat = {
        cardClass: 'gridster-card-view-mode', widgetBodyClass: '',
        leftBtn: {class: "", icon: "crop_square", disabled: false},
        middleBtn: {class: "", icon: "filter_none", disabled: false},
        rightBtn: {class: "disabled", icon: "clear", disabled: true}
      };
    }
    else{
      this._editMode = true;
      this.options.displayGrid = 'always';
      this.options.draggable.enabled = true;
      this.options.resizable.enabled = true;
      this.rendererFormat = {
        cardClass: '', widgetBodyClass: "gridster-card-disabled",
        leftBtn: {class: "disabled", icon: "crop_square", disabled: true},
        middleBtn: {class: "disabled", icon: "filter_none", disabled: true},
        rightBtn: {class: "", icon: "clear", disabled: false}
      }
    }
    this.options.api.optionsChanged();
  }

  maximizeWidget(index: number): void{
    this.maximizeIndex = index;
    this.maximize = true;
  }

  minimizeWidget(): void{
    this.updateModels();
    this.maximize = false;
  }

  deleteWidget(widgetIndex: number): void{
    this.indexToDelete = widgetIndex;

    let deleteRef: MatDialogRef<ConfirmModalComponent> = this.dialog.open(ConfirmModalComponent, {

    });
    
    deleteRef.componentInstance.title = 'Delete Widget';
    deleteRef.componentInstance.message = 'Are you sure you want to remove this widget from you dashboard?'
    deleteRef.componentInstance.icons = [{icon: 'delete_forever', classList: ''}];
    deleteRef.componentInstance.buttons = [{title: 'Confirm', classList: 'btn btn-danger'}];

    deleteRef.componentInstance.btnClick.subscribe(btnClick => {
      switch(btnClick){
        case 'Confirm':{
          this.dashboard.gridItems.splice(this.indexToDelete, 1);
          this.models.splice(this.indexToDelete, 1);
        }
        case 'Cancel': {
          deleteRef.close();
          break;
        }
        default: {
          break;
        }
      }
    });
  }

  stateChanged(state: string, index: number): void{
    this.dashboard.gridItems[index].state = JSON.parse(state);
    this.dashSvc.updateDashboard(this.dashboard).subscribe(
      this.models[index].widget.state = JSON.parse(state)
    );
  }

  popout(index: number): void{
    this.widgetWindowsSvc.addWindow(this.models[index]);
  }

  private updateModels(): void {
    this.dashboard.gridItems = this.dashboard.gridItems.filter((item: WidgetGridItem) => {
      return this.apps.find((app: App) => app.docId === item.parentAppId);
    });
    this.models = this.models.filter((ap: AppWithWidget) => {
      return this.apps.find((app: App) => app.docId === ap.app.docId);
    });
  }

  private instantiateModels(): void{
    this.models = [];
    let widgetsRemoved: boolean = false;

    for(let gridItemIndex = 0; gridItemIndex < this.dashboard.gridItems.length; gridItemIndex++){
      let errorOccurred: boolean = false;

      let parentAppModel: App = this.apps.find(
        (app) => app.docId === this.dashboard.gridItems[gridItemIndex].parentAppId
      );

      if(parentAppModel){
        if(parentAppModel.widgets){
          let widgetModel = Cloner.cloneObject(parentAppModel.widgets.find(
            (widget) => widget.docId === this.dashboard.gridItems[gridItemIndex].widgetId
          ));

          if(widgetModel){
            if(this.dashboard.gridItems[gridItemIndex].state){
              widgetModel.state = Cloner.cloneObject(this.dashboard.gridItems[gridItemIndex].state);
            }
            this.models.push({
              app: parentAppModel,
              widget: widgetModel
            });
          }
          else{
            errorOccurred = true;
            console.error("Error: Parent app " + parentAppModel.appTitle + " does not contain the widget with id " + this.dashboard.gridItems[gridItemIndex].widgetId + ".");
          }
        }
        else{
          errorOccurred = true;
          console.error("Error: Parent app " + parentAppModel.appTitle + " does not contain any widgets. Unable to load widget with id " + this.dashboard.gridItems[gridItemIndex].widgetId + ".");
        }
      }
      else{
        errorOccurred = true;
        console.error("Error: Unable to find parent app with id " + this.dashboard.gridItems[gridItemIndex].parentAppId + " for widget with id " + this.dashboard.gridItems[gridItemIndex].widgetId + ".");
        
      }

      if(errorOccurred){
        this.dashboard.gridItems.splice(gridItemIndex, 1);
        gridItemIndex--;
        widgetsRemoved = true;
      }
    }

    if(widgetsRemoved){
      this.dashSvc.updateDashboard(this.dashboard).subscribe();
    }
  }
}
