import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { UserDashboard } from 'src/app/models/user-dashboard.model';
import { MatTabChangeEvent, MatDialog } from '@angular/material';
import { App } from 'src/app/models/app.model';
import { AppsService } from 'src/app/services/apps.service';
import { UrlGenerator } from '../../../util/url-generator';
import { AuthService } from 'src/app/services/auth.service';
import { Widget } from 'src/app/models/widget.model';
import { DefaultAppIcon } from '../../../util/constants';
import { DashboardService } from 'src/app/services/dashboard.service';
import { DashboardPreviewComponent } from '../dashboard-preview/dashboard-preview.component';
import { WidgetGridItem } from 'src/app/models/widget-grid-item.model';
import { AppWithWidget } from 'src/app/models/app-with-widget.model';
import { CreateTemplateModalComponent } from '../create-template-modal/create-template-modal.component';

@Component({
    selector: 'app-dashboard-manager',
    templateUrl: './dashboard-manager.component.html',
    styleUrls: ['./dashboard-manager.component.scss']
})
export class DashboardManagerComponent implements OnInit {

    apps: Array<App>;
    dashboard: UserDashboard;
    role: string;
    templates: Map<string, Array<UserDashboard>>;

    @ViewChild('gridsterComponent') dashPreviewComponent: DashboardPreviewComponent;
    @ViewChild('widgetSearchBar') searchBar: ElementRef<HTMLInputElement>;

    constructor(
        private appsSvc: AppsService,
        private authSvc: AuthService,
        private dialog: MatDialog,
        private dashSvc: DashboardService
    ) {
        this.apps = new Array<App>();
        this.templates = new Map<string, Array<UserDashboard>>();
    }

    ngOnInit() {
        this.appsSvc.observeLocalAppCache().subscribe((apps) => {
            this.apps = apps;
        });

        this.hardcode();
    }

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
                this.templates.get(dashboard.templateRole).push(dashboard);
            }
            modalRef.close();
        });
    }

    onDashboardClick(template: UserDashboard): void{
        this.dashboard = template;
    }

    onRoleChange(event: MatTabChangeEvent): void{
        this.role = event.tab.textLabel.split(' ')[0].toLowerCase();
    }
    
    onSave(): void{
        // this.dashSvc.updateDashboard(this.dashboard).subscribe((dashboard) => {
        //     this.dashboard = dashboard;
        // });
    }

    onWidgetClick(app: App, widget: Widget): void{
        let gridItem: WidgetGridItem = {
            parentAppId: app.docId,
            widgetId: widget.docId,
            gridsterItem:  widget.gridsterDefault || this.dashPreviewComponent.getGridsterItem()
        };
        this.dashboard.gridItems.push(gridItem);
        this.dashPreviewComponent.instantiateModels();
    }

    updateFilter(){}

    private hardcode(): void{
        this.templates = new Map<string, Array<UserDashboard>>();
        this.templates.set('blue', JSON.parse('[{"default":false,"description":"","docId":"c30769c2-1006-4a25-a486-86502fa789dd","gridItems":[{"gridsterItem":{"cols":3,"rows":3,"x":0,"y":0},"parentAppId":"user-manager","widgetId":"user-count-widget"},{"gridsterItem":{"cols":3,"rows":3,"x":5,"y":0},"parentAppId":"user-manager","widgetId":"user-count-widget"}],"title":"Dashboard 1","type":"userDashboard","userId":"e1c26276-c6d8-4caf-9f7d-76b2601f9f4e"},{"default":false,"description":"","docId":"e78e37a5-ff0d-433b-b1df-6457bac12447","gridItems":[{"gridsterItem":{"cols":8,"rows":3,"x":0,"y":0},"parentAppId":"user-session-tracking","widgetId":"user-session-count-widget"},{"gridsterItem":{"cols":4,"rows":4,"x":0,"y":4},"parentAppId":"user-manager","state":{"chartType":"bar"},"widgetId":"user-chart-widget"},{"gridsterItem":{"cols":4,"rows":4,"x":4,"y":4},"parentAppId":"user-manager","state":{"chartType":"column"},"widgetId":"user-chart-widget"}],"title":"Dashboard 2","type":"userDashboard","userId":"e1c26276-c6d8-4caf-9f7d-76b2601f9f4e"},{"default":false,"description":"","docId":"a7455b61-a7ce-411a-8603-971c4c18325f","gridItems":[{"gridsterItem":{"cols":10,"rows":4,"x":0,"y":4},"parentAppId":"video-chat","widgetId":"video-chat-widget"},{"gridsterItem":{"cols":5,"rows":4,"x":5,"y":0},"parentAppId":"b428d814-e3c7-46df-8327-eb7723a4d66a","widgetId":"b607c830-9e71-4a81-939f-125eaee9848c"},{"gridsterItem":{"cols":5,"rows":4,"x":0,"y":0},"parentAppId":"mm-chat","state":{"activeChannelId":"58pp3obei7fdtqzmozm31afior","activeTeamId":"pjozbjybepgx98qgpz7j6oqqpc"},"widgetId":"mm-chat-widget"}],"title":"Dashboard 3","type":"userDashboard","userId":"e1c26276-c6d8-4caf-9f7d-76b2601f9f4e"},{"default":false,"description":"","docId":"c7baf3ad-f69b-46de-9649-82729b7a4c83","gridItems":[{"gridsterItem":{"cols":8,"rows":5,"x":0,"y":0},"parentAppId":"82e4744d-b1d1-46ca-98f5-7fd2368167b0","widgetId":"1cb29ff4-e1b1-493f-9fee-13d515949661"}],"title":"Permissions Test","type":"userDashboard","userId":"e1c26276-c6d8-4caf-9f7d-76b2601f9f4e"}]'));
        this.templates.set('red', [ ]);
        this.templates.set('white', [ ]); 
        this.role = 'blue';
        this.dashboard = this.templates[0];
        console.log(this.dashboard);
    }
}
