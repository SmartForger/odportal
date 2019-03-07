import { Component, OnInit, Input, ViewChild, OnDestroy, Output, EventEmitter } from '@angular/core';
import { GridsterConfig } from 'angular-gridster2';
import { App } from '../../../models/app.model';
import { Widget } from '../../../models/widget.model';
import { UserDashboard } from 'src/app/models/user-dashboard.model';
import { AppsService } from 'src/app/services/apps.service';
import { ModalComponent } from '../../display-elements/modal/modal.component';
import { WidgetRendererFormat } from '../../../models/widget-renderer-format.model';

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

  @Output() maximize: EventEmitter<{app: App, widget: Widget}>;

  @ViewChild('confirmWidgetDeletionModal') private widgetDeletionModal: ModalComponent;

  apps: Array<App>;
  models: Array<{app: App, widget: Widget, errorOccurred: boolean}>
  options: GridsterConfig;
  indexToDelete: number;
  rendererFormat: WidgetRendererFormat;

  constructor(private appsSvc: AppsService) { 
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
      greenBtnClass: 'greenExpandBtn', yellowBtnClass: 'disabledBtn', redBtnClass: 'disabledBtn',
      greenBtnDisabled: false, yellowBtnDisabled: true, redBtndisabeld: true
    };

    this.maximize = new EventEmitter();
  }

  ngOnInit() {
    this.appsSvc.appStoreSub.subscribe(
      (apps: Array<App>) => {
        apps.forEach(
          (app) => this.apps.push(app)
        );
        this.initHardcode();
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
        greenBtnClass: 'greenExpandBtn', yellowBtnClass: 'disabledBtn', redBtnClass: 'disabledBtn',
        greenBtnDisabled: false, yellowBtnDisabled: true, redBtndisabeld: true
      };
    }
    else{
      this._editMode = true;
      this.options.displayGrid = 'always';
      this.options.draggable.enabled = true;
      this.options.resizable.enabled = true;
      this.rendererFormat = {
        cardClass: '',
        greenBtnClass: 'disabledBtn', yellowBtnClass: 'disabledBtn', redBtnClass: 'redCloseBtn',
        greenBtnDisabled: true, yellowBtnDisabled: true, redBtndisabeld: false
      }
    }
    this.options.api.optionsChanged();
  }

  maximizeWidget(widgetIndex: number): void{
    if(!this.models[widgetIndex].errorOccurred){
      this.maximize.emit({app: this.models[widgetIndex].app, widget: this.models[widgetIndex].widget})
    }
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

  private instantiateModels(): void{
    this.models = [];

    for(let gridItemIndex = 0; gridItemIndex < this.dashboard.gridItems.length; gridItemIndex++){
      let errorOccurred: boolean = false;

      let parentAppModel: App = this.apps.find(
        (app) => app.docId === this.dashboard.gridItems[gridItemIndex].parentAppId
      );

      if(parentAppModel){
        if(parentAppModel.widgets){
          let widgetModel = parentAppModel.widgets.find(
            (widget) => widget.docId === this.dashboard.gridItems[gridItemIndex].widgetId
          );

          if(widgetModel){
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
      }

      if(errorOccurred){
        this.models.push({app: null, widget: null, errorOccurred: true});
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
