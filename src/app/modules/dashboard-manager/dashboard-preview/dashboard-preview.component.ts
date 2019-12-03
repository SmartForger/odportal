//Libraries
import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef, ComponentFactoryResolver, ViewContainerRef, ComponentRef, ChangeDetectorRef, ViewChildren, QueryList } from '@angular/core';
import { GridsterConfig, GridsterItem, GridsterItemComponent, GridsterComponent } from 'angular-gridster2';
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
    selector: 'app-dashboard-preview',
    templateUrl: './dashboard-preview.component.html',
    styleUrls: ['./dashboard-preview.component.scss']
})
export class DashboardPreviewComponent implements OnInit, OnDestroy {
    private _dashboard: UserDashboard;
    @Input('dashboard')
    get dashboard(): UserDashboard {
        return this._dashboard;
    }
    set dashboard(dashboard: UserDashboard) {
        if (this.viewInit) {
            //Only try and instantiate the dashboard if the view is initialized.
            this.instantiateDashboard(dashboard);
        }
        else {
            //If the view is not initialized, the dashboard will be instantiated when it is.
            this._dashboard = dashboard;
        }
    }

    @ViewChild('gridsterEl', { read: ElementRef }) gridster: ElementRef;
    @ViewChild('gridsterEl') gridsterComp: GridsterComponent;
    @ViewChildren('widgetRendererContainer', { read: ViewContainerRef }) rendererContainers: QueryList<ViewContainerRef>;

    viewInit: boolean;
    renderers: Array<ComponentRef<WidgetRendererComponent>>;
    apps: Array<App>;
    models: Array<AppWithWidget>;
    options: GridsterConfig;
    rendererFormat: WidgetRendererFormat;
    resize: Subject<void>;
    maximize: boolean;
    maximizeIndex: number;
    private appCacheSub: Subscription;

    constructor(
        private appsSvc: AppsService,
        private dashSvc: DashboardService,
        private widgetWindowsSvc: WidgetWindowsService,
        private dialog: MatDialog,
        private cdr: ChangeDetectorRef,
        private cfr: ComponentFactoryResolver
    ) {
        this.viewInit = false;
        this.renderers = new Array<ComponentRef<WidgetRendererComponent>>();
        this.resize = new Subject<void>();
        this.options = {
            gridType: 'fit',
            minCols: 8,
            minRows: 8,
            defaultItemCols: 2,
            defaultItemRows: 2,
            displayGrid: 'always',
            margin: 25,
            resizable: {
                enabled: true
            },
            draggable: {
                enabled: true
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
            cardClass: '',
            widgetBodyClass: "gridster-card-disabled",
            buttons: [
                {title: 'Undock', class: "", icon: "filter_none", disabled: false},
                {title: 'Maximize', class: "", icon: "crop_square", disabled: false},
                {title: 'Close', class: "", icon: "clear", disabled: true}
            ]
        };
    }

    ngOnInit() {
        this.subscribeToAppCache();
    }

    ngAfterViewInit() {
        this.viewInit = true;
        this.instantiateDashboard(this._dashboard);
    }

    ngOnDestroy() {
        this.appCacheSub.unsubscribe();
        for (let renderer of this.renderers) {
            renderer.destroy();
        }
    }

    maximizeWidget(id: string): void {
        let index = this.getIndex(id);
        const model = Cloner.cloneObject<any>(this.models[index]);
        model.maximized = true;
        this.widgetWindowsSvc.addWindow(model);
    }

    undockWindow(id: string): void {
        let index = this.getIndex(id);
        const model = Cloner.cloneObject<any>(this.models[index]);
        this.widgetWindowsSvc.addWindow(model);
    }

    deleteWidget(id: string): void {
        let index = this.getIndex(id);
        let deleteRef: MatDialogRef<ConfirmModalComponent> = this.dialog.open(ConfirmModalComponent);

        deleteRef.componentInstance.title = 'Delete Widget';
        deleteRef.componentInstance.message = 'Are you sure you want to remove this widget?'
        deleteRef.componentInstance.icons = [{ icon: 'delete_forever', classList: '' }];
        deleteRef.componentInstance.buttons = [{ title: 'Delete', classList: 'bg-red' }];

        deleteRef.componentInstance.btnClick.subscribe(btnClick => {
            switch (btnClick) {
                case 'Delete': {
                    let rendererIndex = this.renderers.findIndex((rendRef: ComponentRef<WidgetRendererComponent>) => {
                        return rendRef.instance.id === id;
                    });
                    this.renderers[rendererIndex].destroy();
                    this.renderers.splice(rendererIndex, 1);
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

    stateChanged(state: any, id: string): void {
        let index = this.getIndex(id);
        this.dashboard.gridItems[index].state = state;
        this.dashSvc.updateDashboard(this.dashboard).subscribe(() =>
            this.models[index].widget.state = state
        );
    }

    getID() {
        return uuid.v4();
    }

    getGridsterItem() {
        let item: GridsterItem = { x: 0, y: 0, rows: 2, cols: 2 };
        return this.gridsterComp.getFirstPossiblePosition(item);
    }

    instantiateModels(): void {
        this.models = [];
        let widgetsRemoved: boolean = false;

        for (let gridItemIndex = 0; gridItemIndex < this.dashboard.gridItems.length; gridItemIndex++) {
            let errorOccurred: boolean = false;

            let parentAppModel: App = this.apps.find(
                (app) => app.docId === this.dashboard.gridItems[gridItemIndex].parentAppId
            );

            if (parentAppModel) {
                if (parentAppModel.widgets) {
                    let widgetModel = Cloner.cloneObject(parentAppModel.widgets.find(
                        (widget) => widget.docId === this.dashboard.gridItems[gridItemIndex].widgetId
                    ));

                    if (widgetModel) {
                        if (this.dashboard.gridItems[gridItemIndex].state) {
                            widgetModel.state = Cloner.cloneObject(this.dashboard.gridItems[gridItemIndex].state);
                        }
                        this.models.push({
                            app: parentAppModel,
                            widget: widgetModel
                        });
                    }
                    else {
                        errorOccurred = true;
                        console.error("Error: Parent app " + parentAppModel.appTitle + " does not contain the widget with id " + this.dashboard.gridItems[gridItemIndex].widgetId + ".");
                    }
                }
                else {
                    errorOccurred = true;
                    console.error("Error: Parent app " + parentAppModel.appTitle + " does not contain any widgets. Unable to load widget with id " + this.dashboard.gridItems[gridItemIndex].widgetId + ".");
                }
            }
            else {
                console.error("Error: Unable to find parent app with id " + this.dashboard.gridItems[gridItemIndex].parentAppId + " for widget with id " + this.dashboard.gridItems[gridItemIndex].widgetId + ".");
                this.models.push(null);
            }

            if (errorOccurred) {
                this.dashboard.gridItems.splice(gridItemIndex, 1);
                gridItemIndex--;
                widgetsRemoved = true;
            }
        }

        if (widgetsRemoved) {
            this.dashSvc.updateDashboard(this.dashboard).subscribe();
        }
    }

    private getIndex(id: string) {
        let collection: HTMLCollection = this.gridster.nativeElement.getElementsByTagName(`gridster-item`);
        for (let i = 0; i < collection.length; i++) {
            if (collection.item(i).id === id) {
                return i;
            }
        }
    }

    private subscribeToAppCache(): void {
        this.appCacheSub = this.appsSvc.observeLocalAppCache().subscribe(
            (apps: Array<App>) => {
                this.apps = apps;
                if (this.models.length === 0){
                    this.instantiateModels();
                }
            }
        );
    }

    private instantiateDashboard(dashboard: UserDashboard): void {
        //Destroy anny existing dynamic renderers.
        while (this.renderers.length > 0) {
            try {
                this.renderers[0].destroy();
            }
            catch (e) {
                console.log(e);
            }
            this.renderers.splice(0, 1);
        }

        //Lose our old data, then refresh the view. This eliminates all gridster item elements.
        this._dashboard = null;
        this.models = new Array<AppWithWidget>();
        this.gridsterComp.grid = [];
        this.cdr.detectChanges();

        //Ensure the gridster component has no references to the deleted gridster items.
        this.gridsterComp.grid = [];

        //Switch to the new dashboard and new models.
        this._dashboard = dashboard;
        if (this.apps.length > 0 && this._dashboard) {
            this.instantiateModels();
        }
    }

    private createRenderer(gic: GridsterItemComponent) {
        //We use a UUID to map renderers, gridster items, and renderer containers to eachother, and to get a handle on them.
        let id = uuid.v4();
        gic.el.id = id;
        gic.el.getElementsByClassName('widgetRendererContainer')[0].id = id;
        let index = this.getIndex(id);

        if(this.models[index] === null){
            this.renderers.push(null);
        }
        else{
            //Create a new widget renderer component using a factory. Make it a child of the container div in gridster item.
            let factory = this.cfr.resolveComponentFactory(WidgetRendererComponent);
            let vcr = this.rendererContainers.find((item: ViewContainerRef) => {
                return item.element.nativeElement.id === id;
            });
            let comp = vcr.createComponent(factory);

            //Set inputs and subscribe to outputs for the new component.
            comp.instance.id = id;
            comp.instance.app = this.models[index].app;
            comp.instance.widget = this.models[index].widget;
            comp.instance.format = this.rendererFormat;
            comp.instance.resize = this.resize;
            if (this.models[index].widget.state) {
                comp.instance.state = this.models[index].widget.state;
            }
            comp.instance.btnClick.subscribe((btn: string) => this.onBtnClick(btn, id));
            comp.instance.stateChanged.subscribe(($event) => this.stateChanged($event, id));

            //We must detect changes manually here. Angular only automatically detects bindings, not inputs.
            comp.changeDetectorRef.detectChanges();

            //Store the renderer so that we can later destroy it.
            this.renderers.push(comp);
        }
    }

    private onBtnClick(btn: string, id: string){
        switch(btn){
            case 'Undock': this.undockWindow(id); break;
            case 'Maximize': this.maximizeWidget(id); break;
            case 'Close': this.deleteWidget(id); break;
        }
    }
}
