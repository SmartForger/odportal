import { Component, OnInit, OnDestroy, Input, Output, AfterViewInit, EventEmitter } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { Widget } from '../../../models/widget.model';
import { App } from '../../../models/app.model';
import { AuthService } from '../../../services/auth.service';
import { Renderer } from '../renderer';
import { WidgetRendererFormat } from '../../../models/widget-renderer-format.model';
import { AppLaunchRequestService } from '../../../services/app-launch-request.service';
import { ApiRequest } from '../../../models/api-request.model';
import { HttpRequestControllerService } from '../../../services/http-request-controller.service';
import { CustomEventListeners, AppWidgetAttributes } from '../../../util/constants';
import { SharedWidgetCacheService } from '../../../services/shared-widget-cache.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import { FeedbackWidgetComponent } from '../feedback-widget/feedback-widget.component';
import { UrlGenerator } from '../../../util/url-generator';
import { Cloner } from '../../../util/cloner';
import { UserState } from '../../../models/user-state.model';
import { ScriptTrackerService } from 'src/app/services/script-tracker.service';
import { SharedRequestsService } from 'src/app/services/shared-requests.service';
import {WidgetTrackerService} from 'src/app/services/widget-tracker.service';

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
    let container = document.getElementById(this.containerId);
    if(container){
      while(container.firstChild){
        container.removeChild(container.firstChild);
      }
    }
    this._widget = widget;
    if (this.isInitialized) {
      this.load();
    }
  }

  private _format: WidgetRendererFormat
  @Input('format')
  get format(): WidgetRendererFormat {
    return this._format
  }
  set format(format: WidgetRendererFormat) {
    this._format = format;
  }

  private _minimized: boolean
  @Input('minimized')
  get minimized(): boolean {
    return this._minimized;
  }
  set minimized(minimized: boolean) {
    this._minimized = minimized;
    if (this.widget && !this.minimized) {
      this.load();
    }
  }

  @Input('state')
  get state(): any {
    if (this.widget && this.widget.state) {
      return this.widget.state;
    }
    return null;
  }
  set state(state: any) {
    if (this.widget && state != null) {
      this.widget.state = state;
    }
  }

  @Input('resize')
  set resize(resize: Subject<any>) {
    resize.subscribe(
      (resize) => {
        if (this.customElem) {
          this.makeCallback(this.resizeCallback, resize);
        }
      }
    );
  }

  @Output() leftBtnClick: EventEmitter<void>;
  @Output() middleBtnClick: EventEmitter<void>;
  @Output() rightBtnClick: EventEmitter<void>;
  @Output() titleBarClick: EventEmitter<void>;
  @Output() stateChanged: EventEmitter<any>;

  id: string;
  private cacheSub: Subscription;
  private resizeCallback: Function;
  private widgetCacheCallback: Function;

  constructor(
    private authSvc: AuthService,
    private httpControllerSvc: HttpRequestControllerService,
    private appLaunchSvc: AppLaunchRequestService,
    private cacheSvc: SharedWidgetCacheService,
    private dialog: MatDialog,
    private scriptTrackerSvc: ScriptTrackerService,
    private sharedRequestSvc: SharedRequestsService,
    private trackerSvc: WidgetTrackerService) {
    super();
    this.minimized = false;
    this.format = {
      cardClass: '', widgetBodyClass: "",
      leftBtn: { class: "", icon: "", disabled: true },
      middleBtn: { class: "", icon: "", disabled: true },
      rightBtn: { class: "", icon: "", disabled: true }
    }
    this.leftBtnClick = new EventEmitter<void>();
    this.middleBtnClick = new EventEmitter<void>();
    this.rightBtnClick = new EventEmitter<void>();
    this.titleBarClick = new EventEmitter<void>();
    this.stateChanged = new EventEmitter<any>();
    this.id = '';
  }

  ngOnInit() {
    this.trackerSvc.add(this.widget.docId);
    this.subscribeToUserSession();
  }

  ngAfterViewInit() {
    this.isInitialized = true;
    if (this.widget && !this.minimized) {
      this.load();
    }
  }

  ngOnDestroy() {
    this.trackerSvc.remove(this.widget.docId);
    if (this.userSessionSub) {
      this.userSessionSub.unsubscribe();
    }
    if (this.cacheSub) {
      this.cacheSub.unsubscribe();
    }
    if(this.sharedRequestsSub){
      this.sharedRequestsSub.unsubscribe();
    }
  }

  feedback() {
    let dialogRef: MatDialogRef<FeedbackWidgetComponent> = this.dialog.open(FeedbackWidgetComponent, {
      data: {
        widgetId: this.widget.docId,
        widgetTitle: this.widget.widgetTitle,
        appId: this.app.docId
      }
    });
    dialogRef.componentInstance.close.subscribe(() => dialogRef.close());
  }

  load(): void {
    let container = document.getElementById(this.containerId);
    this.customElem = this.buildCustomElement(this.widget.widgetTag);
    this.setupElementIO();
    let script;
    if (this.app.native) {
      script = this.buildNativeScriptTag('assets/widgets/' + this.widget.widgetBootstrap);
    }
    else {
      script = this.buildThirdPartyScriptTag(this.authSvc.globalConfig.appsServiceConnection, this.app, this.widget.widgetBootstrap);
    }
    if (!this.scriptTrackerSvc.exists(script.src)) {
      this.scriptTrackerSvc.setScriptStatus(script.src, false);
      script.onload = () => {
        this.scriptTrackerSvc.setScriptStatus(script.src, true);
        container.appendChild(this.customElem);
        this.setAttributeValue(AppWidgetAttributes.IsInit, "true");
      };
      document.body.appendChild(script);
    }
    else if(this.scriptTrackerSvc.loaded(script.src)){
      container.appendChild(this.customElem);
      this.setAttributeValue(AppWidgetAttributes.IsInit, "true");
    }
    else{
      this.scriptTrackerSvc.subscribeToLoad(script.src).subscribe(() => {
        container.appendChild(this.customElem);
        this.setAttributeValue(AppWidgetAttributes.IsInit, "true");
      });
    }
  }

  handleClick(handler: EventEmitter<void>, ev: Event) {
    ev.stopPropagation();
    handler.emit();
  }

  protected setupElementIO(): void {
    this.attachInitCallbackListener();
    this.attachHttpRequestListener();
    this.attachHttpAbortListener();
    this.attachAppLaunchRequestListener();
    this.attachWidgetStateChangeListener();
    this.attachUserStateCallbackListener();
    this.attachResizeCallbackListener();
    this.attachWidgetCacheCallbackListener();
    this.attachWidgetCacheWriteListener();
    this.attachSharedRequestsCallbackListener();
  }

  protected attachInitCallbackListener(): void {
    this.customElem.addEventListener(CustomEventListeners.OnInitCallback, ($event: CustomEvent) => {
      if (this.isFunction($event.detail.callback)) {
        this.initCallback = $event.detail.callback;
        const userState: UserState = Cloner.cloneObject<UserState>(this.authSvc.userState);
        const coreServices: Object = this.authSvc.getCoreServicesMap();
        const cache: Object = this.cacheSvc.readFromCache(this.widget.docId);
        const state: Object = this.widget.state || {};
        const baseUrl: string = UrlGenerator.generateAppResourceUrl(this.authSvc.globalConfig.appsServiceConnection, this.app);
        this.initCallback({
          userState: userState,
          coreServices: coreServices,
          cache: cache,
          state: state,
          baseUrl: baseUrl
        });
      }
    });
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
        this.userStateCallback(Cloner.cloneObject<UserState>(this.authSvc.userState));
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

  private attachWidgetCacheCallbackListener(): void {
    this.customElem.addEventListener(CustomEventListeners.OnWidgetCacheCallback, ($event: CustomEvent) => {
      if (this.isFunction($event.detail.callback)) {
        this.widgetCacheCallback = $event.detail.callback;
        this.cacheSub = this.cacheSvc.subscribeToCache(this.widget.docId).subscribe((value: Object) => {
          this.widgetCacheCallback(Cloner.cloneObject<Object>(value));
        });
      }
    });
  }

  private attachWidgetStateChangeListener(): void {
    this.customElem.addEventListener(CustomEventListeners.OnStateChangeEvent, ($event: CustomEvent) => {
      this.stateChanged.emit($event.detail);
    });
  }

  private attachAppLaunchRequestListener(): void {
    this.customElem.addEventListener(CustomEventListeners.OnAppLaunchRequestEvent, (event: CustomEvent) => {
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

  private attachWidgetCacheWriteListener(): void {
    this.customElem.addEventListener(CustomEventListeners.OnSharedWidgetCacheWrite, ($event: CustomEvent) => {
      this.cacheSvc.writeToCache(this.widget.docId, $event.detail);
    });
  }

  protected attachSharedRequestsCallbackListener(): void {
    this.customElem.addEventListener(CustomEventListeners.OnSharedRequestsCallback, ($event: CustomEvent) => {
      if(this.isFunction($event.detail.callback)){
        this.sharedRequestsCallback = $event.detail.callback;
        this.sharedRequestsSub = this.sharedRequestSvc.subToAppData(this.widget.docId).subscribe((data: any) => {
          if(data){
            this.sharedRequestsCallback(data);
          }
        });
      }
    });
  } 

  protected subscribeToUserSession(): void {
    this.userSessionSub = this.authSvc.observeUserSessionUpdates().subscribe(
      (userId: string) => {
        if (userId === this.authSvc.getUserId()) {
          this.makeCallback(this.userStateCallback, Cloner.cloneObject<UserState>(this.authSvc.userState));
        }
      }
    );
  }

}
