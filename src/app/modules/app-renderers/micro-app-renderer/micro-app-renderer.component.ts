import { Component, OnInit, OnDestroy, Input, AfterViewInit } from '@angular/core';
import { App } from '../../../models/app.model';
import { AuthService } from '../../../services/auth.service';
import { Renderer } from '../renderer';
import { ApiRequest } from 'src/app/models/api-request.model';
import { HttpRequestControllerService } from '../../../services/http-request-controller.service';
import { CustomEventListeners, AppWidgetAttributes } from '../../../util/constants';
import { AppLaunchRequestService } from '../../../services/app-launch-request.service';
import { UrlGenerator } from '../../../util/url-generator';
import {Cloner} from '../../../util/cloner';

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
          this.makeCallback(this.userStateCallback, Cloner.cloneObject<Object>(this.authSvc.userState));
        }
      }
    );
  }

  load(): void {
    let container = document.getElementById(this.containerId);
    this.customElem = this.buildCustomElement(this.app.appTag);
    this.setupElementIO();
    container.appendChild(this.customElem);
    const script = this.buildThirdPartyScriptTag(this.authSvc.globalConfig.appsServiceConnection, this.app, this.app.appBootstrap);
    if (!this.scriptExists(script.url)) {
      script.onload = () => {
        this.setAttributeValue(AppWidgetAttributes.IsInit, "true");
      };
      document.body.appendChild(script);
    }
    else {
      this.setAttributeValue(AppWidgetAttributes.IsInit, "true");
    }
  }

  private setupElementIO(): void {
    this.attachHttpRequestListener();
    this.attachHttpAbortListener();
    this.attachUserStateCallbackListener();
    this.attachCoreServicesCallbackListener();
    this.attachBaseDirectoryCallbackListener();
    this.attachAppStateCallbackListener();
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

  private attachAppStateCallbackListener(): void {
    this.customElem.addEventListener(CustomEventListeners.OnAppStateCallback, ($event: CustomEvent) => {
      if (this.isFunction($event.detail.calllback)) {
        this.appStateCallback = $event.detail.callback;
        if (this.launchReqSvc.appStates.get(this.app.docId)) {
          this.appStateCallback(this.launchReqSvc.appStates.get(this.app.docId));
        }
      }
    });
  }

}
