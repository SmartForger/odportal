import { Component, OnInit, Input, ComponentFactoryResolver, ComponentFactory, Type, ViewChild, ElementRef, ViewContainerRef, ComponentRef } from '@angular/core';
import { App } from 'src/app/models/app.model';
import * as uuid from 'uuid';
import { PersonalInformationComponent } from '../../user-manager/personal-information/personal-information.component';
import { SecurityAndAccessComponent } from '../../user-manager/security-and-access/security-and-access.component';
import { DynamicallyRenderable } from 'src/app/interfaces/dynamically-renderable';
import { AffiliationsComponent } from '../../user-manager/affiliations/affiliations.component';

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

    @Input() 
    get state(): any{return this._state;}
    set state(state: any){this.setState(state);}
    private _state: any;

    @ViewChild('container', {read: ViewContainerRef})
    container: ViewContainerRef;

    containerId: number;
    injectState: boolean;

    private compRef: ComponentRef<DynamicallyRenderable>;
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

    private getComponentType(app: App): Type<DynamicallyRenderable>{
        switch(app.appTag){
            case 'app-affiliations': return AffiliationsComponent;
            case 'app-personal-information': return PersonalInformationComponent;
            case 'app-security-and-access': return SecurityAndAccessComponent;
            default: return null;
        }
    }

    private renderComponent(): void{
        const componentType: Type<any> = this.getComponentType(this.app);
        const factory = this.cfr.resolveComponentFactory(componentType);
        this.container.clear();
        this.compRef = this.container.createComponent(factory);
        this.setState(this.state);
    }

    private setApp(app: App): void{
        this._app = app;
        if(this.init){
            this.renderComponent();
        }
    }

    private setState(state: any): void{
        this._state = state;
        if(this.compRef !== undefined && this.state !== undefined){
            this.compRef.instance.setState(this.state);
        }
    }
}
