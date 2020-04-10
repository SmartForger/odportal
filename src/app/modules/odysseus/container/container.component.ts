import { Component, OnInit, Input } from '@angular/core';
import { Branch, Container } from 'src/app/models/container.model';
import { App } from 'src/app/models/app.model';
import { AppsService } from 'src/app/services/apps.service';
import { Subscription } from 'rxjs';
import { UrlGenerator } from 'src/app/util/url-generator';
import { AuthService } from 'src/app/services/auth.service';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
    selector: 'app-container',
    templateUrl: './container.component.html',
    styleUrls: ['./container.component.scss'],
    animations: [
        trigger('appScroll', [
            state('top', style({top: '-100%'})),
            state('middle', style({top: '0%'})),
            state('bottom', style({top: '100%'})),
            transition('middle => top', [animate('0.2s')]),
            transition('top => middle', [animate('0.2s')]),
            transition('middle => bottom', [animate('0.2s')]),
            transition('bottom => middle', [animate('0.2s')]),
        ])
    ]
})
export class ContainerComponent implements Container, OnInit {
    @Input()
    get branches(): Array<Branch>{return this._branches;}
    set branches(branches: Array<Branch>){this.setBranches(branches);} 
    private _branches: Array<Branch>;
    @Input() root: any;

    apps: Array<Array<App>>;
    branchIndex: number;
    selectedAppIndices: Array<number>;

    private appCache: Array<App>;
    private appCacheSub: Subscription;

    constructor(
        private appSvc: AppsService,
        private authSvc: AuthService
    ) {
        this.apps = new Array<Array<App>>();
        this.branches = new Array<Branch>();
        this.root = null;
        this.selectedAppIndices = new Array<number>();
    
        this.appCacheSub = this.appSvc.observeLocalAppCache().subscribe((appCache: Array<App>) => {
            this.appCache = appCache;
        });
    }

    ngOnInit() {
        this.appCacheSub.unsubscribe();
    }

    generateResourceURL(app: App): string {
        return UrlGenerator.generateAppResourceUrl(this.authSvc.globalConfig.appsServiceConnection, app, app.appIcon);
    }

    onAppClick(branchIndex: number, appIndex: number): void{
        this.selectedAppIndices[branchIndex] = appIndex;
    }

    private setBranches(branches: Array<Branch>){
        this._branches = branches;
        this.apps = new Array<Array<App>>();
        this.selectedAppIndices = new Array<number>();
        branches.forEach((branch: Branch, index: number) => {
            this.apps.push(new Array<App>());
            if(branch.apps.length > 0){
                this.selectedAppIndices.push(0);
            }
            branch.apps.forEach((appId: string) => {
                let app = this.appCache.find((model: App) => {return model.docId === appId;});
                if(app !== undefined){
                    this.apps[index].push(app);
                }
            });
        });

    }
}
