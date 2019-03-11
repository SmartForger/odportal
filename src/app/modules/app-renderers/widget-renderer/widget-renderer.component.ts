import { Component, OnInit, OnDestroy, Input, Output, AfterViewInit, EventEmitter } from '@angular/core';
import {Widget} from '../../../models/widget.model';
import {App} from '../../../models/app.model';
import {AuthService} from '../../../services/auth.service';
import {Renderer} from '../renderer';
import { WidgetRendererFormat } from '../../../models/widget-renderer-format.model';
import {AppLaunchRequestService} from '../../../services/app-launch-request.service';

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

  @Output() greenBtnClick: EventEmitter<null>;
  @Output() yellowBtnClick: EventEmitter<null>;
  @Output() redBtnClick: EventEmitter<null>;
  @Output() stateChanged: EventEmitter<any>;
  
  constructor(private authSvc: AuthService, private appLaunchSvc: AppLaunchRequestService) { 
    super();
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
    if (!this.started && this.widget && !this.previewMode) {
      this.load();
    }
  }

  ngOnDestroy() {
    this.destroy();
    this.userSessionSub.unsubscribe();
  }

  protected subscribeToUserSession(): void {
    this.userSessionSub = this.authSvc.sessionUpdatedSubject.subscribe(
      (userId: string) => {
        if (userId === this.authSvc.getUserId() && this.customElem && this.started) {
          this.customElem.setAttribute('user-state', this.authSvc.userState);
          if(this.widget.state){
            this.customElem.setAttribute('state', this.widget.state);
          }
        }
      }
    );
  }

  load(): void {
    let container = document.getElementById(this.containerId);
    if(this.widget.widgetBootstrap != ''){
      this.script = this.buildScriptTag(
        this.authSvc.globalConfig.appsServiceConnection, 
        this.app.vendorId, 
        this.app.clientName, 
        this.app.version, 
        this.widget.widgetBootstrap);
      this.script.onload = () => {
        this.customElem = this.buildCustomElement(this.widget.widgetTag, this.authSvc.userState);
        if(this.widget.state){
          this.customElem.setAttribute('state', JSON.stringify(this.widget.state));
        }
        this.customElem.addEventListener('stateChanged', ($event) => this.stateChanged.emit($event.detail));
        container.appendChild(this.customElem);
        this.started = true;
      };
      container.appendChild(this.script);
    }
    else{ //Don't inject scripts for hardcoded widgets, otherwise identical to the block above
      this.customElem = this.buildCustomElement(this.widget.widgetTag, this.authSvc.userState);
      if(this.widget.state){
        this.customElem.setAttribute('state', JSON.stringify(this.widget.state));
      }
      this.customElem.addEventListener('stateChanged', ($event) => this.stateChanged.emit($event.detail));

      container.appendChild(this.customElem);
      this.attachAppLaunchRequestListener();
      this.started = true;
    }
    
  }

  temp(state: any){
    
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

  test(){console.log('test')};

}
