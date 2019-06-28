//Libraries
import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef, ComponentFactoryResolver, ViewContainerRef, ComponentRef, ChangeDetectorRef, ViewChildren, QueryList, ContentChildren } from '@angular/core';
import { GridsterConfig, GridsterItem, GridsterItemComponentInterface, GridsterItemComponent, GridsterComponent } from 'angular-gridster2';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Subject, Subscription } from 'rxjs';
import * as uuid from 'uuid';

//Services
import { AppsService } from 'src/app/services/apps.service';
import { DashboardService } from 'src/app/services/dashboard.service';
import { WidgetWindowsService } from 'src/app/services/widget-windows.service';

//Components && Classes
import { ConfirmModalComponent } from '../../display-elements/confirm-modal/confirm-modal.component';
import { WidgetRendererComponent } from '../../app-renderers/widget-renderer/widget-renderer.component';
import { Cloner } from '../../../util/cloner';

//Models
import { App } from '../../../models/app.model';
import { UserDashboard } from 'src/app/models/user-dashboard.model';
import { WidgetRendererFormat } from '../../../models/widget-renderer-format.model';
import { WidgetGridItem } from '../../../models/widget-grid-item.model';
import { AppWithWidget } from '../../../models/app-with-widget.model';

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
    if(this.viewInit){
      //Only try and instantiate the dashboard if the view is initialized.
      this.instantiateDashboard(dashboard);
    }
    else{
      //If the view is not initialized, the dashboard will be instantiated when it is.
      this._dashboard = dashboard;
    }
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

  @ViewChild('gridsterEl', {read: ElementRef}) gridster: ElementRef;
  @ViewChild('gridsterEl') gridsterComp: GridsterComponent;
  @ViewChildren('widgetRendererContainer', {read: ViewContainerRef}) rendererContainers: QueryList<ViewContainerRef>;
  
  private viewInit: boolean;
  private appCacheSub: Subscription;
  private renderers: Array<ComponentRef<WidgetRendererComponent>>;

  apps: Array<App>;
  models: Array<AppWithWidget>
  options: GridsterConfig;
  rendererFormat: WidgetRendererFormat;
  resize: Subject<void>;

  maximize: boolean;
  maximizeIndex: number;

  constructor(
    private appsSvc: AppsService, 
    private dashSvc: DashboardService, 
    private widgetWindowsSvc: WidgetWindowsService, 
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private cfr: ComponentFactoryResolver,
    private vcr: ViewContainerRef) 
  { 
    this.viewInit = false;
    this.renderers = new Array<ComponentRef<WidgetRendererComponent>>();
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
      itemResizeCallback: (item: GridsterItem, gridsterItemComponent: GridsterItemComponent) => {
        this.resize.next();
      },
      itemInitCallback: (item: GridsterItem, gridsterItemComponent: GridsterItemComponent) => {
        this.createRenderer(gridsterItemComponent);
      }
    };

    this.apps = new Array<App>();
    this.models = new Array<AppWithWidget>();

    this.rendererFormat = {
      cardClass: 'gridster-card-view-mode', widgetBodyClass: '',
      leftBtn: {class: "minimize", icon: "remove", disabled: false},
      middleBtn: {class: "", icon: "crop_square", disabled: false},
      rightBtn: {class: "", icon: "clear", disabled: true}
    };
  }

  ngOnInit() {
    this.subscribeToAppCache();
  }

  ngAfterViewInit(){
    this.viewInit = true;
    this.instantiateDashboard(this._dashboard);
  }

  ngOnDestroy() {
    this.appCacheSub.unsubscribe();
    for(let renderer of this.renderers){
      renderer.destroy();
    }
  }

  maximizeWidget(id: string): void{
    let index = this.getIndex(id);
    const model = Cloner.cloneObject<any>(this.models[index]);
    model.maximized = true;
    this.widgetWindowsSvc.addWindow(model);
  }

  minimizeWidget(id: string): void{
    let index = this.getIndex(id);
    const model = Cloner.cloneObject<any>(this.models[index]);
    model.docked = true;
    this.widgetWindowsSvc.addWindow(model);
  }

  deleteWidget(id: string): void{
    let index = this.getIndex(id);
    let deleteRef: MatDialogRef<ConfirmModalComponent> = this.dialog.open(ConfirmModalComponent);
    
    deleteRef.componentInstance.title = 'Delete Widget';
    deleteRef.componentInstance.message = 'Are you sure you want to remove this widget?'
    deleteRef.componentInstance.icons = [{icon: 'delete_forever', classList: ''}];
    deleteRef.componentInstance.buttons = [{title: 'Delete', classList: 'bg-red'}];

    deleteRef.componentInstance.btnClick.subscribe(btnClick => {
      switch(btnClick){
        case 'Delete':{
          this.dashboard.gridItems.splice(index, 1);
          this.models.splice(index, 1);
        }
        default: {
          deleteRef.close();
          break;
        }
      }
    });
  }

  stateChanged(state: any, id: string): void{
    let index = this.getIndex(id);
    this.dashboard.gridItems[index].state = state;
    this.dashSvc.updateDashboard(this.dashboard).subscribe(() => 
      this.models[index].widget.state = state
    );
  }

  getID(){
    return uuid.v4();
  }

  private getIndex(id: string){
    let collection: HTMLCollection = this.gridster.nativeElement.getElementsByTagName(`gridster-item`);
    for(let i = 0; i < collection.length; i++){
      if(collection.item(i).id === id){
        return i;
      }
    }
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

  private instantiateDashboard(dashboard: UserDashboard): void{
    //Destroy anny existing dynamic renderers.
    while(this.renderers.length > 0){
      this.renderers[0].destroy();
      this.renderers.splice(0, 1);
    }

    //Lose our old data, then refresh the view. This eliminates all gridster item elements.
    this._dashboard = null;
    this.models = new Array<AppWithWidget>();
    this.cdr.detectChanges();

    //Ensure the gridster component has no references to the deleted gridster items.
    this.gridsterComp.grid = [];

    //Switch to the new dashboard and new models.
    this._dashboard = dashboard;
    if(this.apps.length > 0 && this._dashboard){
      this.instantiateModels();
    }
  }

  createRenderer(gic: GridsterItemComponent){
    //Use the x,y coordinates of the grid item to get it's index.
    let id = uuid.v4();
    gic.el.id = id;
    gic.el.getElementsByClassName('widgetRendererContainer')[0].id = id;
    let index = this.getIndex(id);

    //Create a new widget renderer component using a factory. Make it a child of the container div in gridster item.
    let factory = this.cfr.resolveComponentFactory(WidgetRendererComponent);
    let vcr = this.rendererContainers.find((item: ViewContainerRef) => {
      return item.element.nativeElement.id === id;
    });
    let comp = vcr.createComponent(factory);

    //Set inputs and subscribe to outputs for the new component.
    comp.instance.app = this.models[index].app;
    comp.instance.widget = this.models[index].widget;
    comp.instance.format = this.rendererFormat;
    comp.instance.resize = this.resize;
    comp.instance.leftBtnClick.subscribe(() => this.minimizeWidget(id));
    comp.instance.middleBtnClick.subscribe(() => this.maximizeWidget(id));
    comp.instance.rightBtnClick.subscribe(() => this.deleteWidget(id));
    comp.instance.stateChanged.subscribe(($event) => this.stateChanged($event, id));

    //We must detect changes manually here. Angular only automatically detects bindings, not inputs.
    comp.changeDetectorRef.detectChanges();

    //Store the renderer so that we can later destroy it.
    this.renderers.push(comp);
  }

  private toggleEditMode(){
    if(this._editMode){
      this._editMode = false;
      this.options.displayGrid = 'none';
      this.options.draggable.enabled = false;
      this.options.resizable.enabled = false;
      this.rendererFormat = {
        cardClass: 'gridster-card-view-mode', widgetBodyClass: '',
        leftBtn: {class: "", icon: "crop_square", disabled: false},
        middleBtn: {class: "", icon: "filter_none", disabled: false},
        rightBtn: {class: "", icon: "clear", disabled: true}
      };
    }
    else{
      this._editMode = true;
      this.options.displayGrid = 'always';
      this.options.draggable.enabled = true;
      this.options.resizable.enabled = true;
      this.rendererFormat = {
        cardClass: '', widgetBodyClass: "gridster-card-disabled",
        leftBtn: {class: "", icon: "crop_square", disabled: true},
        middleBtn: {class: "", icon: "filter_none", disabled: true},
        rightBtn: {class: "", icon: "clear", disabled: false}
      }
    }
    this.renderers.forEach((renderer: ComponentRef<WidgetRendererComponent>) => {
      renderer.instance.format = this.rendererFormat;
      renderer.changeDetectorRef.detectChanges();
    });
    this.options.api.optionsChanged();
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
