import { Component, OnInit, OnDestroy, Input, Output, AfterViewInit, EventEmitter } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import {Widget} from '../../../models/widget.model';
import {App} from '../../../models/app.model';
import {AuthService} from '../../../services/auth.service';
import {Renderer} from '../renderer';
import { WidgetRendererFormat } from '../../../models/widget-renderer-format.model';
import {AppLaunchRequestService} from '../../../services/app-launch-request.service';
import {ApiRequest} from '../../../models/api-request.model';
import {HttpRequestControllerService} from '../../../services/http-request-controller.service';
import {CustomEventListeners, AppWidgetAttributes} from '../../../util/constants';
import {SharedWidgetCacheService} from '../../../services/shared-widget-cache.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import { FeedbackWidgetComponent } from '../feedback-widget/feedback-widget.component';
import {UrlGenerator} from '../../../util/url-generator';
import {StateMutator} from '../../../util/state-mutator';
import {Cloner} from '../../../util/cloner';

@Component({
  selector: 'app-widget-renderer',
  templateUrl: './widget-renderer.component.html',
  styleUrls: ['./widget-renderer.component.scss']
})
export class WidgetRendererComponent extends Renderer implements OnInit, OnDestroy, AfterViewInit {

  private resizeCallback: Function;
  private widgetStateCallback: Function;
  private widgetCacheCallback: Function;

  @Input() app: App;

  private _widget: Widget;
  @Input('widget')
  get widget(): Widget {
    return this._widget;
  }
  set widget(widget: Widget) {
    this._widget = widget;
    this.destroy();
    if (this.isInitialized) {
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
  }

  private _minimized: boolean
  @Input('minimized')
  get minimized(): boolean{
    return this._minimized;
  }
  set minimized(minimized: boolean){
    this._minimized = minimized;
    if(this.widget && !this.minimized){
      this.load();
    }
  }
  
  @Input('state') 
  get state(): any{
    if(this.widget && this.widget.state){
      return this.widget.state;
    }
    return null;
  }
  set state(state: any){
    if(this.widget && state != null){
      this.widget.state = state;
      this.makeCallback(this.widgetStateCallback, Cloner.cloneObject<any>(state));
      //this.setAttributeValue(AppWidgetAttributes.WidgetState, StateMutator.stringifyState(state));
      //this.setAttributeValue(AppWidgetAttributes.WidgetState, JSON.stringify(state));
    }
  }

  @Input('resize')
  set resize(resize: Subject<any>){
    resize.subscribe(
      (resize) => {
        if (this.customElem) {
          this.makeCallback(this.resizeCallback, resize);
          //this.customElem.setAttribute('resize', JSON.stringify(resize));
        }
      }
    );
  }

  @Output() leftBtnClick: EventEmitter<void>;
  @Output() middleBtnClick: EventEmitter<void>;
  @Output() rightBtnClick: EventEmitter<void>;
  @Output() stateChanged: EventEmitter<any>;

  private _cacheSub: Subscription;
  
  constructor(
    private authSvc: AuthService,
    private httpControllerSvc: HttpRequestControllerService,
    private appLaunchSvc: AppLaunchRequestService,
    private cacheSvc: SharedWidgetCacheService,
    private dialog: MatDialog) { 
    super();
    this.minimized = false;
    this.format = {
      cardClass: '', widgetBodyClass: "",
      leftBtn: {class: "", icon: "", disabled: true},
      middleBtn: {class: "", icon: "", disabled: true},
      rightBtn: {class: "", icon: "", disabled: true}
    }
    this.leftBtnClick=new EventEmitter<void>();
    this.middleBtnClick=new EventEmitter<void>();
    this.rightBtnClick=new EventEmitter<void>();
    this.stateChanged=new EventEmitter<any>();
  }

  ngOnInit() {
    this.subscribeToUserSession();
  }

  ngAfterViewInit() {
    this.isInitialized = true;
    if (this.widget && !this.minimized) {
      this.load();
    }
  }

  ngOnDestroy() {
    this.destroy();
    if (this.userSessionSub) {
      this.userSessionSub.unsubscribe();
    }
  }

  feedback() {
    let dialogRef: MatDialogRef<FeedbackWidgetComponent> = this.dialog.open(FeedbackWidgetComponent, {data: {
      widgetId: this.widget.docId,
      appId: this.app.docId
    }});
    dialogRef.componentInstance.close.subscribe(() => dialogRef.close());
  }

  load(): void {
    let container = document.getElementById(this.containerId);
    if (!this.app.native) {
      this.script = this.buildScriptTag(this.authSvc.globalConfig.appsServiceConnection, this.app, this.widget.widgetBootstrap);
      this.script.onload = () => {
        this.customElem = this.buildCustomElement(this.widget.widgetTag);
        container.appendChild(this.customElem);
        this.setupElementIO();
      };
      container.appendChild(this.script);
    }
    else { //Don't inject scripts for hardcoded widgets, otherwise identical to the block above
      this.customElem = this.buildCustomElement(this.widget.widgetTag);
      container.appendChild(this.customElem);
      this.setupElementIO();
    }
    
  }

  protected setupElementIO(): void{
    this.attachHttpRequestListener();
    this.attachHttpAbortListener();
    this.attachAppLaunchRequestListener();
    this.attachWidgetStateChangeListener();
    this.attachUserStateCallbackListener();
    this.attachCoreServicesCallbackListener();
    this.attachBaseDirectoryCallbackListener();
    this.attachResizeCallbackListener();
    this.attachWidgetStateCallbackListener();
    this.attachWidgetCacheCallbackListener();
    this.attachSharedWidgetCache();
    //this.setAttributeValue(AppWidgetAttributes.CoreServiceConnections, JSON.stringify(this.authSvc.getCoreServicesMap()));
    //this.setAttributeValue(AppWidgetAttributes.UserState, this.authSvc.userState);
    /*if (this.widget.state) {
      this.setAttributeValue(AppWidgetAttributes.WidgetState, StateMutator.stringifyState(this.widget.state));
      //this.setAttributeValue(AppWidgetAttributes.WidgetState, JSON.stringify(this.widget.state));
    }*/
    //this.setAttributeValue(AppWidgetAttributes.BaseDirectory, UrlGenerator.generateAppResourceUrl(this.authSvc.globalConfig.appsServiceConnection, this.app));
  }

  protected attachHttpRequestListener(): void {
    this.customElem.addEventListener(CustomEventListeners.OnHttpRequestEvent, ($event: CustomEvent) => {
      let request: ApiRequest = $event.detail;
      request.appId = this.app.docId;
      request.widgetId = this.widget.docId;
      this.httpControllerSvc.send(request);
    });
  }

  protected attachHttpAbortListener(): void {
    this.customElem.addEventListener(CustomEventListeners.OnHttpAbortEvent, ($event: CustomEvent) => {
      this.httpControllerSvc.cancelRequest($event.detail);
    });
  }

  protected attachUserStateCallbackListener(): void {
    this.customElem.addEventListener(CustomEventListeners.OnUserStateCallback, ($event: CustomEvent) => {
        if (this.isFunction($event.detail.callback)) {
            this.userStateCallback = $event.detail.callback;
            this.userStateCallback(Cloner.cloneObject<Object>(this.authSvc.userState));
        }
    });
}

protected attachCoreServicesCallbackListener(): void {
    this.customElem.addEventListener(CustomEventListeners.OnCoreServicesCallback, ($event: CustomEvent) => {
        if (this.isFunction($event.detail.callback)) {
            this.coreServicesCallback = $event.detail.callback;
            this.coreServicesCallback(this.authSvc.getCoreServicesMap());
        }
    });
}

protected attachBaseDirectoryCallbackListener(): void {
    this.customElem.addEventListener(CustomEventListeners.OnBaseDirectoryCallback, ($event: CustomEvent) => {
        if (this.isFunction($event.detail.callback)) {
            this.baseDirectoryCallback = $event.detail.callback;
            this.baseDirectoryCallback(UrlGenerator.generateAppResourceUrl(this.authSvc.globalConfig.appsServiceConnection, this.app));
        }
    });
}

  private attachResizeCallbackListener(): void {
    this.customElem.addEventListener(CustomEventListeners.OnResizeCallback, ($event: CustomEvent) => {
      if (this.isFunction($event.detail.callback)) {
        this.resizeCallback = $event.detail.callback;
      }
    });
  }

  private attachWidgetStateCallbackListener(): void {
    this.customElem.addEventListener(CustomEventListeners.OnWidgetStateCallback, ($event: CustomEvent) => {
      if (this.isFunction($event.detail.callback)) {
        this.widgetStateCallback = $event.detail.callback;
        if (this.widget.state) {
          this.widgetStateCallback(Cloner.cloneObject<any>(this.widget.state));
        }
      }
    });
  }

  private attachWidgetCacheCallbackListener(): void {
    this.customElem.addEventListener(CustomEventListeners.OnWidgetCacheCallback, ($event: CustomEvent) => {
      if (this.isFunction($event.detail.callback)) {
        this.widgetCacheCallback = $event.detail.callback;
        let tempSub: Subscription = this.cacheSvc.subscribeToCache(this.widget.widgetTag).subscribe(
          (value: any) => {
            this.widgetCacheCallback(value);
            tempSub.unsubscribe();
          }
        );
      }
    });
  }

  private attachWidgetStateChangeListener(): void {
    this.customElem.addEventListener(CustomEventListeners.OnStateChangeEvent, ($event: CustomEvent) => {
      console.log($event);
      this.stateChanged.emit($event.detail);
    });
  }

  private attachAppLaunchRequestListener(): void {
    this.customElem.addEventListener(CustomEventListeners.OnAppLaunchRequestEvent, (event: CustomEvent) => {
      console.log("app launch request received");
      let launchPath = "";
      if (this.app.native) {
        launchPath = this.app.nativePath;
      }
      else {
        launchPath = "/portal/app/" + this.app.docId;
      }
      this.appLaunchSvc.requestLaunch(
        {
          launchPath: launchPath,
          appId: this.app.docId,
          data: event.detail
        }
      );
    });
  }

  private attachSharedWidgetCache(){
    this._cacheSub = this.cacheSvc.subscribeToCache(this.widget.widgetTag).subscribe((value: any) => {
      //this.setAttributeValue(AppWidgetAttributes.SharedWidgetCache, JSON.stringify(value));
      this.setAttributeValue(AppWidgetAttributes.SharedWidgetCache, StateMutator.stringifyState(value));
      this.makeCallback(this.widgetCacheCallback, Cloner.cloneObject<any>(value));
    });
    this.customElem.addEventListener(CustomEventListeners.OnSharedWidgetCacheWrite, ($event: CustomEvent) => {
      this.cacheSvc.writeToCache(this.widget.widgetTag, $event.detail)
    });
  }

  protected subscribeToUserSession(): void {
    this.userSessionSub = this.authSvc.observeUserSessionUpdates().subscribe(
      (userId: string) => {
        if (userId === this.authSvc.getUserId()) {
          console.log(this.widget.widgetTitle + ': attaching user state');
          //this.setAttributeValue(AppWidgetAttributes.UserState, this.authSvc.userState);
          this.makeCallback(this.userStateCallback, Cloner.cloneObject<Object>(this.authSvc.userState));
        }
      }
    );
  }

}
