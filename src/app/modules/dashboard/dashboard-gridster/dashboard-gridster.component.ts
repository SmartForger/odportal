import { Component, OnInit, Input, ViewChild, OnDestroy, Output, EventEmitter } from '@angular/core';
import { GridsterConfig } from 'angular-gridster2';
import { App } from '../../../models/app.model';
import { Widget } from '../../../models/widget.model';
import { UserDashboard } from 'src/app/models/user-dashboard.model';
import { AppsService } from 'src/app/services/apps.service';
import { ModalComponent } from '../../display-elements/modal/modal.component';
import { WidgetRendererFormat } from '../../../models/widget-renderer-format.model';
import { DashboardService } from 'src/app/services/dashboard.service';
import { Cloner } from '../../../util/cloner';
import { WidgetWindowsService } from 'src/app/services/widget-windows.service';

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
    this.instantiateModels();
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

  @ViewChild('confirmWidgetDeletionModal') private widgetDeletionModal: ModalComponent;

  apps: Array<App>;
  models: Array<{app: App, widget: Widget, errorOccurred: boolean}>
  options: GridsterConfig;
  indexToDelete: number;
  rendererFormat: WidgetRendererFormat;

  maximize: boolean;
  maximizeIndex: number;
  maximizeRendererFormat: WidgetRendererFormat;

  constructor(private appsSvc: AppsService, private dashSvc: DashboardService, private widgetWindowsSvc: WidgetWindowsService) { 
    this._editMode = false;

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

    this.apps = [];

    this.rendererFormat = {
      cardClass: 'gridster-card-view-mode',
      greenBtnClass: 'greenExpandBtn', yellowBtnClass: 'yellowMinimizeBtn', redBtnClass: 'disabledBtn',
      greenBtnDisabled: false, yellowBtnDisabled: false, redBtndisabeld: true
    };

    this.maximizeRendererFormat = {
      cardClass: 'gridster-card-view-mode',
      greenBtnClass: 'disabledBtn', yellowBtnClass: 'yellowMinimizeBtn', redBtnClass: 'redCloseBtn',
      greenBtnDisabled: true, yellowBtnDisabled: false, redBtndisabeld: false
    }
  }

  ngOnInit() {
    this.appsSvc.appStoreSub.subscribe(
      (apps: Array<App>) => {
        apps.forEach(
          (app) => this.apps.push(app)
        );
        this.instantiateModels();
      },
      (err: any) => {console.log(err);}
    );
  }

  ngOnDestroy() {
    //this.appsSvc.appStoreSub.unsubscribe();
  }

  toggleEditMode(){
    if(this._editMode){
      this._editMode = false;
      this.options.displayGrid = 'none';
      this.options.draggable.enabled = false;
      this.options.resizable.enabled = false;
      this.rendererFormat = {
        cardClass: 'gridster-card-view-mode',
        greenBtnClass: 'greenExpandBtn', yellowBtnClass: 'yellowMinimizeBtn', redBtnClass: 'disabledBtn',
        greenBtnDisabled: false, yellowBtnDisabled: false, redBtndisabeld: true
      };
    }
    else{
      this._editMode = true;
      this.options.displayGrid = 'always';
      this.options.draggable.enabled = true;
      this.options.resizable.enabled = true;
      this.rendererFormat = {
        cardClass: 'gridster-card-disabled',
        greenBtnClass: 'disabledBtn', yellowBtnClass: 'disabledBtn', redBtnClass: 'redCloseBtn',
        greenBtnDisabled: true, yellowBtnDisabled: true, redBtndisabeld: false
      }
    }
    this.options.api.optionsChanged();
  }

  maximizeWidget(index: number): void{
    this.maximizeIndex = index;
    this.maximize = true;
  }

  minimizeWidget(): void{
    this.instantiateModels();
    this.maximize = false;
  }

  confirmWidgetDelete(widgetIndex: number): void{
    this.indexToDelete = widgetIndex;
    this.widgetDeletionModal.show = true;
  }

  deleteWidget(buttonTitle: string): void{
    this.widgetDeletionModal.show = false;
    if(buttonTitle === 'confirm'){
      this.dashboard.gridItems.splice(this.indexToDelete, 1);
      this.models.splice(this.indexToDelete, 1);
    }
  }

  stateChanged(state: string, index: number): void{
    this.dashboard.gridItems[index].state = JSON.parse(state);
    this.dashSvc.updateDashboard(this.dashboard).subscribe(
      this.models[index].widget.state = JSON.parse(state)
    );
  }

  popout(index: number): void{
    this.widgetWindowsSvc.addWindowSub.next(this.models[index]);
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
              widget: widgetModel,
              errorOccurred: false
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
        console.error("Removing the widget from the dashboard.");
        this.dashboard.gridItems.splice(gridItemIndex, 1);
        gridItemIndex--;
        widgetsRemoved = true;
      }

      if(errorOccurred){
        this.models.push({app: null, widget: null, errorOccurred: true});
      }
    }

    if(widgetsRemoved){
      this.dashSvc.updateDashboard(this.dashboard).subscribe();
    }
  }
}
