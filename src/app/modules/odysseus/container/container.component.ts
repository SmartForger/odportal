import { Component, OnInit, Input } from '@angular/core';
import { Branch, Container } from 'src/app/models/container.model';
import { App } from 'src/app/models/app.model';
import { AppsService } from 'src/app/services/apps.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-container',
    templateUrl: './container.component.html',
    styleUrls: ['./container.component.scss']
})
export class ContainerComponent implements Container, OnInit {
    @Input()
    get branches(): Array<Branch>{return this._branches;}
    set branches(branches: Array<Branch>){this.setBranches(branches);} 
    private _branches: Array<Branch>;
    @Input() root: any;

    apps: Array<Array<App>>;
    branchIndex: number;
    selectedAppIndex: number;

    private appCache: Array<App>;
    private appCacheSub: Subscription;

    constructor(
        private appSvc: AppsService
    ) {
        this.apps = new Array<Array<App>>();
        this.branches = new Array<Branch>();
        this.root = null;
        this.selectedAppIndex = undefined;
    
        this.appCacheSub = this.appSvc.observeLocalAppCache().subscribe((appCache: Array<App>) => {
            this.appCache = appCache;
        });
    }

    ngOnInit() {
        this.appCacheSub.unsubscribe();
    }

    onAppClick(index: number): void{
        this.selectedAppIndex = index;
    }

    private setBranches(branches: Array<Branch>){
        this._branches = branches;
        this.apps = new Array<Array<App>>();
        branches.forEach((branch: Branch, index: number) => {
            this.apps.push(new Array<App>());            
            branch.apps.forEach((appId: string) => {
                let app = this.appCache.find((model: App) => {return model.docId === appId;});
                if(app !== undefined){
                    this.apps[index].push(app);
                }
            });
        });
        console.log('branches: ...', this.branches);
        console.log('apps: ...', this.apps);
    }
}
