import { Component, OnInit, Input, ComponentFactoryResolver, ChangeDetectorRef, ViewChildren, QueryList, ElementRef, Renderer2 } from '@angular/core';
import { Branch, Container } from 'src/app/models/container.model';
import { App } from 'src/app/models/app.model';
import { AppsService } from 'src/app/services/apps.service';
import { Subscription } from 'rxjs';
import { UrlGenerator } from 'src/app/util/url-generator';
import { AuthService } from 'src/app/services/auth.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { MicroAppRendererComponent } from '../../app-renderers/micro-app-renderer/micro-app-renderer.component';
import { MatTabChangeEvent } from '@angular/material';

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
    @Input() state: any;

    @ViewChildren('renderer', {read: ElementRef}) rendererElements: QueryList<ElementRef>;

    apps: Array<Array<App>>;
    branchIndex: number;
    selectedAppIndices: Array<number>;

    private appCache: Array<App>;
    private appCacheSub: Subscription;
    private secondRender: Array<number>;

    constructor(
        private appSvc: AppsService,
        private authSvc: AuthService,
        private renderer: Renderer2
    ) {
        this.apps = new Array<Array<App>>();
        this.branches = new Array<Branch>();
        this.root = null;
        this.secondRender = new Array<number>();
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
        console.log('branchIndex: ', branchIndex)
        console.log('appIndex', appIndex);
        this.selectedAppIndices[branchIndex] = appIndex;console.log(this.selectedAppIndices);
    }

    /*****************************************************************************************************
    * For some reason, angular animations don't apply styles on precisely the second time a tab is opened.
    * All the renderers end up stacked on top of eachother until their animations are triggered manually.
    * This programatically enforces positioning the second time a user opens a tab.
    ******************************************************************************************************/
    onTabChange(event: MatTabChangeEvent){
        console.log(this.rendererElements);
        if(this.secondRender[event.index] < 2){
            this.secondRender[event.index] = this.secondRender[event.index] + 1;
        }

        if(this.secondRender[event.index] === 2){
            const selectedAppIndex = this.selectedAppIndices[event.index];
            this.rendererElements.forEach((renderEl: ElementRef) => {
                const branchIndex = Number.parseInt(renderEl.nativeElement.getAttribute('branchindex'));
                if(branchIndex === event.index){
                    const appindex = Number.parseInt(renderEl.nativeElement.getAttribute('appindex'));
                    const top = appindex < selectedAppIndex ? '-100%' 
                              : appindex > selectedAppIndex ? '100%' 
                              : '0%';
                    this.renderer.setStyle(renderEl.nativeElement, 'top', top);
                }
            });
        }
    }

    private setBranches(branches: Array<Branch>){
        this._branches = branches;
        this.apps = new Array<Array<App>>();
        this.secondRender = new Array<number>();
        this.selectedAppIndices = new Array<number>();
        branches.forEach((branch: Branch, index: number) => {
            this.secondRender.push(0);
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
