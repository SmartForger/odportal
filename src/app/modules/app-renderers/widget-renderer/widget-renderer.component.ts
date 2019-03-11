import { Component, OnInit, OnDestroy, Input, Output, AfterViewInit, EventEmitter } from '@angular/core';
import {Widget} from '../../../models/widget.model';
import {App} from '../../../models/app.model';
import {AuthService} from '../../../services/auth.service';
import {Renderer} from '../renderer';
import { WidgetRendererFormat } from '../../../models/widget-renderer-format.model';
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

  @Output() greenBtnClick: EventEmitter<null>;
  @Output() yellowBtnClick: EventEmitter<null>;
  @Output() redBtnClick: EventEmitter<null>;
  
  constructor(
    private authSvc: AuthService,
    private httpControllerSvc: HttpRequestControllerService) { 
    super();
    this.format = {
      cardClass: '',
      greenBtnClass: '', yellowBtnClass: '', redBtnClass: '',
      greenBtnDisabled: true, yellowBtnDisabled: true, redBtndisabeld: true
    }
    this.greenBtnClick=new EventEmitter();
    this.yellowBtnClick=new EventEmitter();
    this.redBtnClick=new EventEmitter();
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
        this.attachHttpRequestListener();
        container.appendChild(this.customElem);
        this.started = true;
      };
      container.appendChild(this.script);
    }
    else{
      this.customElem = this.buildCustomElement(this.widget.widgetTag, this.authSvc.userState);
      container.appendChild(this.customElem);
      this.started = true;
    }
    
  }

  protected attachHttpRequestListener(): void {
    this.customElem.addEventListener(this.HTTP_REQUEST_EVENT, ($event: CustomEvent) => {
      const request: ApiRequest = $event.detail;
      this.httpControllerSvc.send(request);
    });
  }

  private fillMissingFormatFields(): void{
    if(!this._format.cardClass){this._format.cardClass=''}
    if(!this._format.greenBtnClass){this._format.greenBtnClass=''}
    if(!this._format.yellowBtnClass){this._format.yellowBtnClass=''}
    if(!this._format.redBtnClass){this._format.redBtnClass=''}
    if(!this._format.greenBtnDisabled){this._format.greenBtnDisabled=true}
    if(!this._format.yellowBtnDisabled){this._format.yellowBtnDisabled=true}
    if(!this._format.redBtndisabeld){this._format.redBtndisabeld=true}
  }

}
