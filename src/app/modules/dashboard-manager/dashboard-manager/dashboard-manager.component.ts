import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { UserDashboard, DashboardTemplateGridChanges } from 'src/app/models/user-dashboard.model';
import { MatTabChangeEvent, MatDialog, MatDialogRef, MatDialogModule } from '@angular/material';
import { App } from 'src/app/models/app.model';
import { AppsService } from 'src/app/services/apps.service';
import { UrlGenerator } from '../../../util/url-generator';
import { AuthService } from 'src/app/services/auth.service';
import { Widget } from 'src/app/models/widget.model';
import { DefaultAppIcon } from '../../../util/constants';
import { DashboardPreviewComponent } from '../dashboard-preview/dashboard-preview.component';
import { WidgetGridItem } from 'src/app/models/widget-grid-item.model';
import { CreateTemplateModalComponent } from '../create-template-modal/create-template-modal.component';
import { DashboardTemplateService } from 'src/app/services/dashboard-template.service';
import { Cloner } from 'src/app/util/cloner';
import { ConfirmModalComponent } from '../../display-elements/confirm-modal/confirm-modal.component'
import * as uuid from 'uuid';
import { RenameModalComponent } from '../rename-modal/rename-modal.component';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'app-dashboard-manager',
    templateUrl: './dashboard-manager.component.html',
    styleUrls: ['./dashboard-manager.component.scss']
})
export class DashboardManagerComponent implements OnInit {

    apps: Array<App>;
    dashboard: UserDashboard;
    dashInit: boolean;
    gridChanges: DashboardTemplateGridChanges;
    role: string;
    tabIndex: number;
    templates: Map<string, Array<UserDashboard>>;
    updatedGridItemIds: Set<string>;

    @ViewChild('gridsterComponent') dashPreviewComponent: DashboardPreviewComponent;
    @ViewChild('widgetSearchBar') searchBar: ElementRef<HTMLInputElement>;

    constructor(
        private appsSvc: AppsService,
        private authSvc: AuthService,
        private dialog: MatDialog,
        private dashTemplateSvc: DashboardTemplateService
    ) {
        this.apps = new Array<App>();
        this.dashInit = false;
        this.gridChanges = {
            addedGridItems: new Array<WidgetGridItem>(),
            updatedGridItems: new Array<WidgetGridItem>(),
            removedGridItems: new Array<WidgetGridItem>()
        };
        this.role = 'blue';
        this.tabIndex = 0;
        this.templates = new Map<string, Array<UserDashboard>>();
        this.updatedGridItemIds = new Set<string>();

        this.appsSvc.observeLocalAppCache().subscribe((apps) => {
            this.apps = apps;
        });

        forkJoin([
            this.dashTemplateSvc.listTemplatesByRole('blue'),
            this.dashTemplateSvc.listTemplatesByRole('red'),
            this.dashTemplateSvc.listTemplatesByRole('white')
        ]).subscribe((results: [UserDashboard[], UserDashboard[], UserDashboard[]]) => {
            this.templates.set('blue', results[0]);
            this.templates.set('red', results[1]);
            this.templates.set('white', results[2]);

            if(results[0].length > 0){this.setDashboard(results[0][0])}
            else if(results[1].length > 0){this.setDashboard(results[1][0])}
            else if(results[2].length > 0){this.setDashboard(results[2][0])}
        });
    }

    ngOnInit() { }

    filterWidget(title: string): boolean{
        if(this.searchBar.nativeElement.value){
            return title.toLowerCase().includes(this.searchBar.nativeElement.value.toLowerCase());
        }
        else{
            return true;
        }
    }

    getWidgetIcon(widget: Widget, app: App): string {
        let url: string;
        if (widget.icon) {
            url = UrlGenerator.generateAppResourceUrl(this.authSvc.globalConfig.appsServiceConnection, app, widget.icon);
        }
        else if (app.appIcon) {
            url = UrlGenerator.generateAppResourceUrl(this.authSvc.globalConfig.appsServiceConnection, app, app.appIcon);
        }
        else {
            url = DefaultAppIcon;
        }
        return url;
    }

    onCreateClick(): void{
        let modalRef = this.dialog.open(CreateTemplateModalComponent, { });
        modalRef.componentInstance.dashboard.subscribe((dashboard: UserDashboard) => {
            if(dashboard !== null){
                this.dashTemplateSvc.createTemplate(dashboard).subscribe((template: UserDashboard) => {
                    this.templates.get(dashboard.templateRole).push(template);
                    this.setDashboard(template);
                });
            }
            modalRef.close();
        });
    }

    onDashboardClick(template: UserDashboard): void{
        this.setDashboard(template);
    }

    onDashInit(): void{
        this.dashInit = true;
    }

    onDeleteClick(): void{
        let deleteRef: MatDialogRef<ConfirmModalComponent> = this.dialog.open(ConfirmModalComponent, { });

        deleteRef.componentInstance.title = 'Delete Dashboard Template';
        deleteRef.componentInstance.message = `Are you sure you want to delete ${this.dashboard.title}? All users in the associated role will lose acces to it, and this action cannot be undone.`;
        deleteRef.componentInstance.icons =  [{icon: 'remove_circle_outline', classList: ''}];
        deleteRef.componentInstance.buttons = [{title: 'Delete', classList: 'bg-red'}];

        deleteRef.componentInstance.btnClick.subscribe(btnClick => {
            if(btnClick === 'Delete'){
                let index = this.templates.get(this.dashboard.templateRole).findIndex((dash: UserDashboard) => {return dash.docId === this.dashboard.docId;});
                this.templates.get(this.dashboard.templateRole).splice(index, 1);
                this.dashTemplateSvc.deleteTemplate(this.dashboard.docId).subscribe();
                this.dashboard = null;
            }
            deleteRef.close();
        });
    }

    onDeletedGridItem(wgi: WidgetGridItem): void{
        console.log('deleting grid item');
        console.log(wgi);
        this.gridChanges.removedGridItems.push(wgi);
    }

    onEditClick(): void{
        let renameRef: MatDialogRef<RenameModalComponent> = this.dialog.open(RenameModalComponent, { });
        renameRef.componentInstance.title = this.dashboard.title;
        renameRef.componentInstance.saveTitle.subscribe((newTitle: string) => {
            if(newTitle !== this.dashboard.title){
                this.dashboard.title = newTitle;
                this.dashTemplateSvc.renameTemplate(this.dashboard.docId, newTitle).subscribe();
                this.templates.get(this.dashboard.templateRole).find((dash: UserDashboard) => {return dash.docId === this.dashboard.docId}).title = newTitle;
            }
            renameRef.close();
        });
    }

    onGridItemChange(widgetGridItem: WidgetGridItem): void{
        if(this.dashInit){
            this.updatedGridItemIds.add(widgetGridItem.gridId);
        }
    }

    onRoleChange(event: MatTabChangeEvent): void{
        this.role = event.tab.textLabel.split(' ')[0].toLowerCase();
    }
    
    onSave(): void{
        this.saveChanges();
    }

    onWidgetClick(app: App, widget: Widget): void{
        let gridItem: WidgetGridItem = {
            gridId: uuid.v4(),
            parentAppId: app.docId,
            widgetId: widget.docId,
            gridsterItem:  widget.gridsterDefault || this.dashPreviewComponent.getGridsterItem()
        };
        this.dashboard.gridItems.push(gridItem);
        this.gridChanges.addedGridItems.push(gridItem);
        this.dashPreviewComponent.instantiateModels();
    }

    updateFilter(){}

    private saveChanges(): void{
        this.updatedGridItemIds.forEach((id: string) => {
            let item = this.dashboard.gridItems.find((wgi: WidgetGridItem) => {return wgi.gridId === id;});
            if(item !== undefined){this.gridChanges.updatedGridItems.push(item);}
        });
        this.dashTemplateSvc.updateTemplate(this.dashboard.docId, this.gridChanges).subscribe((template: UserDashboard) => {
            let index = this.templates.get(template.templateRole).findIndex((dash: UserDashboard) => {return dash.templateId === template.templateId});
            this.templates.get(template.templateRole)[index] = template;
            this.setDashboard(template);
        });
    }

    private setDashboard(dashboard: UserDashboard){
        this.dashInit = false;
        if(dashboard.templateRole === 'blue'){this.tabIndex = 0;}
        else if(dashboard.templateRole === 'red'){this.tabIndex = 1;}
        else{this.tabIndex = 2;}
        this.updatedGridItemIds = new Set<string>();
        this.gridChanges = {
            addedGridItems: new Array<WidgetGridItem>(),
            updatedGridItems: new Array<WidgetGridItem>(),
            removedGridItems: new Array<WidgetGridItem>()
        };
        dashboard.gridItems.forEach((item: WidgetGridItem) => {
            if(!item.hasOwnProperty('gridId')){
                item['gridId'] = uuid.v4();
            }
        });
        this.dashboard = Cloner.cloneObject(dashboard);
    }
}
