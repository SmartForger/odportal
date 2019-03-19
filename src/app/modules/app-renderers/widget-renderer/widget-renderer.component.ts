import { Component, OnInit, OnDestroy, Input, Output, AfterViewInit, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import {Widget} from '../../../models/widget.model';
import {App} from '../../../models/app.model';
import {AuthService} from '../../../services/auth.service';
import {Renderer} from '../renderer';
import { WidgetRendererFormat } from '../../../models/widget-renderer-format.model';
import {AppLaunchRequestService} from '../../../services/app-launch-request.service';
import {ApiRequest} from '../../../models/api-request.model';
import {HttpRequestControllerService} from '../../../services/http-request-controller.service';

@Component({
  selector: 'app-widget-renderer',
  templateUrl: './widget-renderer.component.html',
  styleUrls: ['./widget-renderer.component.scss']
})
export class WidgetRendererComponent extends Renderer implements OnInit, OnDestroy, AfterViewInit {

  @Input() app: App;

  private _widget: Widget;
  @Input('widget')
  get widget(): Widget {
    return this._widget;
  }
  set widget(widget: Widget) {
    this._widget = widget;
    this.destroy();
    if (!this.previewMode && this.isInitialized) {
      this.load();
    }
  }

  private _format: WidgetRendererFormat
  @Input('format')
  get format(): WidgetRendererFormat{
    return this._format
  }
  set format(format: WidgetRendererFormat){
    this._format = format;
    this.fillMissingFormatFields();
  }

  private _minimized: boolean
  @Input('minimized')
  get minimized(): boolean{
    return this._minimized;
  }
  set minimized(minimized: boolean){
    this._minimized = minimized;
    if(!this.started && this.widget && !this.previewMode && !this.minimized){
      this.load();
    }
  }
  
  @Input('state')
  get state(): any{
    if(this.widget && this.widget.state){
      return this.widget.state;
    }
    else{
      return null;
    }
  }
  set state(state: any){
    if(this.started && this.widget && state != null){
      this.widget.state = state;
      this.customElem.setAttribute('appstate', JSON.stringify(state));
    }
  }

  @Input('resize')
  set resize(resize: Subject<any>){
    resize.subscribe(
      (resize) => {if(this.customElem){this.customElem.setAttribute('resize', JSON.stringify(resize));}}
    );
  }

  @Output() greenBtnClick: EventEmitter<null>;
  @Output() yellowBtnClick: EventEmitter<null>;
  @Output() redBtnClick: EventEmitter<null>;
  @Output() stateChanged: EventEmitter<any>;
  
  constructor(
    private authSvc: AuthService,
    private httpControllerSvc: HttpRequestControllerService,
    private appLaunchSvc: AppLaunchRequestService) { 
    super();
    this.minimized = false;
    this.format = {
      cardClass: '',
      greenBtnClass: '', yellowBtnClass: '', redBtnClass: '',
      greenBtnDisabled: true, yellowBtnDisabled: true, redBtndisabeld: true
    }
    this.greenBtnClick=new EventEmitter();
    this.yellowBtnClick=new EventEmitter();
    this.redBtnClick=new EventEmitter();
    this.stateChanged=new EventEmitter();
  }

  ngOnInit() {
    this.subscribeToUserSession();
  }

  ngAfterViewInit() {
    this.isInitialized = true;
    if (!this.started && this.widget && !this.previewMode && !this.minimized) {
      this.load();
    }
  }

  ngOnDestroy() {
    this.destroy();
    this.userSessionSub.unsubscribe();
  }

  load(): void {
    let container = document.getElementById(this.containerId);
    if(!this.app.native){
      this.script = this.buildScriptTag(
        this.authSvc.globalConfig.appsServiceConnection, 
        this.app.vendorId, 
        this.app.clientName, 
        this.app.version, 
        this.widget.widgetBootstrap);
      this.script.onload = () => {
        this.customElem = this.buildCustomElement(this.widget.widgetTag, this.authSvc.userState);
        this.setupElementIO();
        container.appendChild(this.customElem);
        this.started = true;
      };
      container.appendChild(this.script);
    }
    else{ //Don't inject scripts for hardcoded widgets, otherwise identical to the block above
      this.customElem = this.buildCustomElement(this.widget.widgetTag, this.authSvc.userState);
      container.appendChild(this.customElem);
      this.started = true;
      this.setupElementIO();
      
    }
    
  }

  protected setupElementIO(): void{
    this.setupWidgetState();
    this.attachHttpRequestListener();
    this.attachAppLaunchRequestListener();
    this.subscribeToUserSession();
    this.customElem.setAttribute('userstate', this.authSvc.userState);
  }

  protected subscribeToUserSession(): void {
    this.userSessionSub = this.authSvc.sessionUpdatedSubject.subscribe(
      (userId: string) => {
        if (userId === this.authSvc.getUserId() && this.customElem && this.started) {
          console.log(this.widget.widgetTitle + ': attaching user state');
          this.customElem.setAttribute('userstate', this.authSvc.userState);
        }
      }
    );
  }

  protected setupWidgetState(): void{
    if(this.widget.state){
      this.customElem.setAttribute('widgetstate', JSON.stringify(this.widget.state));
    }
    this.customElem.addEventListener('onStateChange', ($event: CustomEvent) => this.stateChanged.emit($event.detail));
  }

  protected attachHttpRequestListener(): void {
    this.customElem.addEventListener(this.HTTP_REQUEST_EVENT, ($event: CustomEvent) => {
      const request: ApiRequest = $event.detail;
      this.httpControllerSvc.send(request);
    });
  }

  private attachAppLaunchRequestListener(): void {
    this.customElem.addEventListener('onAppLaunchRequest', (event: CustomEvent) => {
      console.log("app launch request received");
      this.appLaunchSvc.requestLaunch(
        {
          launchPath: '/portal/user-manager',
          data: event.detail
        }
      );
    });
  }

  private fillMissingFormatFields(): void{
    if(!this._format.cardClass){this._format.cardClass=''}
    if(!this._format.greenBtnClass){this._format.greenBtnClass=''}
    if(!this._format.yellowBtnClass){this._format.yellowBtnClass=''}
    if(!this._format.redBtnClass){this._format.redBtnClass=''}
    if(!('greenBtnDisabled' in this._format)){this._format.greenBtnDisabled=true}
    if(!('yellowBtnDisabled' in this._format)){this._format.yellowBtnDisabled=true}
    if(!('redBtnDisabled' in this._format)){this._format.redBtndisabeld=true}
  }

}
