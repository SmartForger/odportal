import { Component, OnInit, Input, ComponentFactoryResolver, ComponentFactory, Type, ViewChild, ElementRef, ViewContainerRef } from '@angular/core';
import { App } from 'src/app/models/app.model';
import * as uuid from 'uuid';

@Component({
    selector: 'app-native-component-renderer',
    templateUrl: './native-component-renderer.component.html',
    styleUrls: ['./native-component-renderer.component.scss']
})
export class NativeComponentRendererComponent implements OnInit {

    @Input()
    get app(): App {return this._app;}
    set app(app: App){this.setApp(app);}
    private _app: App;

    @ViewChild('container', {read: ViewContainerRef})
    container: ViewContainerRef;

    containerId: number;

    private init: boolean;

    constructor(private cfr: ComponentFactoryResolver) {
        this.containerId = uuid.v4();
        this.init = false;
    }

    ngOnInit() { }

    ngAfterViewInit(){
        this.init = true;
        if(this.app){
            this.renderComponent();
        }
    }

    private getComponentType(app: App): Type<any>{
        switch(app.appTag){
            case '': 
            default: return null;
        }
    }

    private renderComponent(): void{
        const componentType: Type<any> = this.getComponentType(this.app);
        const factory = this.cfr.resolveComponentFactory(componentType);
        this.container.clear();
        this.container.createComponent(factory);
    }

    private setApp(app: App): void{
        this._app = app;
        if(this.init){
            this.renderComponent();
        }
    }
}
