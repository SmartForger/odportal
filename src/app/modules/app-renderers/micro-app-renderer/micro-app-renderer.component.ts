import { Component, OnInit, OnDestroy, Input, AfterViewInit } from '@angular/core';
import { App } from '../../../models/app.model';
import { AuthService } from '../../../services/auth.service';
import { Renderer } from '../renderer';
import { ApiRequest } from 'src/app/models/api-request.model';
import { HttpRequestControllerService } from '../../../services/http-request-controller.service';
import { CustomEventListeners, AppWidgetAttributes } from '../../../util/constants';
import { AppLaunchRequestService } from '../../../services/app-launch-request.service';
import { UrlGenerator } from '../../../util/url-generator';
import { StateMutator } from '../../../util/state-mutator';

@Component({
  selector: 'app-micro-app-renderer',
  templateUrl: './micro-app-renderer.component.html',
  styleUrls: ['./micro-app-renderer.component.scss']
})
export class MicroAppRendererComponent extends Renderer implements OnInit, OnDestroy, AfterViewInit {

  private appStateCallback: Function;

  private _app: App;
  @Input('app')
  get app(): App {
    return this._app;
  }
  set app(app: App) {
    this._app = app;
    this.destroy();
    if (this.isInitialized) {
      this.load();
      console.log("loading outside of after view init");
    }
  }

  constructor(
    private authSvc: AuthService,
    private launchReqSvc: AppLaunchRequestService,
    private httpControllerSvc: HttpRequestControllerService) {
    super();
  }

  ngOnInit() {
    this.subscribeToUserSession();
  }

  ngAfterViewInit() {
    this.isInitialized = true;
    if (this.app) {
      this.load();
      console.log("after view init");
    }
  }

  ngOnDestroy() {
    this.destroy();
    if (this.userSessionSub) {
      this.userSessionSub.unsubscribe();
    }
    console.log("app renderer destroyed");
  }

  protected subscribeToUserSession(): void {
    this.userSessionSub = this.authSvc.observeUserSessionUpdates().subscribe(
      (userId: string) => {
        if (userId === this.authSvc.getUserId()) {
          this.setAttributeValue(AppWidgetAttributes.UserState, this.authSvc.userState);
        }
      }
    );
  }

  load(): void {
    let container = document.getElementById(this.containerId);
    this.script = this.buildScriptTag(this.authSvc.globalConfig.appsServiceConnection, this.app, this.app.appBootstrap);
    this.script.onload = () => {
      console.log(this.script.src + " loaded!");
      this.customElem = this.buildCustomElement(this.app.appTag);
      container.appendChild(this.customElem);
      this.setupElementIO();
    };
    container.appendChild(this.script);
  }

  private setupElementIO(): void {
    this.attachHttpRequestListener();
    this.attachHttpAbortListener();
    this.attachUserStateCallbackListener();
    this.attachCoreServicesCallbackListener();
    this.attachBaseDirectoryCallbackListener();
    this.attachAppStateCallbackListener();
    this.setAttributeValue(AppWidgetAttributes.UserState, this.authSvc.userState);
    this.setAttributeValue(AppWidgetAttributes.CoreServiceConnections, JSON.stringify(this.authSvc.getCoreServicesMap()));
    if (this.launchReqSvc.appStates.get(this.app.docId)) {
      this.setAttributeValue(AppWidgetAttributes.AppState, StateMutator.stringifyState(this.launchReqSvc.appStates.get(this.app.docId)));
      //this.setAttributeValue(AppWidgetAttributes.AppState, JSON.stringify(this.launchReqSvc.appState));
    }
    this.setAttributeValue(AppWidgetAttributes.BaseDirectory, UrlGenerator.generateAppResourceUrl(this.authSvc.globalConfig.appsServiceConnection, this.app));
  }

  protected attachHttpAbortListener(): void {
    this.customElem.addEventListener(CustomEventListeners.OnHttpAbortEvent, ($event: CustomEvent) => {
      this.httpControllerSvc.cancelRequest($event.detail);
    });
  }

  protected attachHttpRequestListener(): void {
    this.customElem.addEventListener(CustomEventListeners.OnHttpRequestEvent, ($event: CustomEvent) => {
      let request: ApiRequest = $event.detail;
      request.appId = this.app.docId;
      this.httpControllerSvc.send(request);
    });
  }

  protected attachUserStateCallbackListener(): void {
    this.customElem.addEventListener(CustomEventListeners.OnUserStateCallback, ($event: CustomEvent) => {
      if (this.isFunction($event.detail.callback)) {
        this.userStateCallback = $event.detail.callback;
      }
    });
  }

  protected attachCoreServicesCallbackListener(): void {
    this.customElem.addEventListener(CustomEventListeners.OnCoreServicesCallback, ($event: CustomEvent) => {
      if (this.isFunction($event.detail.callback)) {
        this.coreServicesCallback = $event.detail.callback;
      }
    });
  }

  protected attachBaseDirectoryCallbackListener(): void {
    this.customElem.addEventListener(CustomEventListeners.OnBaseDirectoryCallback, ($event: CustomEvent) => {
      if (this.isFunction($event.detail.callback)) {
        this.baseDirectoryCallback = $event.detail.callback;
      }
    });
  }

  private attachAppStateCallbackListener(): void {
    this.customElem.addEventListener(CustomEventListeners.OnAppStateCallback, ($event: CustomEvent) => {
      if (this.isFunction($event.detail.calllback)) {
        this.appStateCallback = $event.detail.callback;
      }
    });
  }

}
