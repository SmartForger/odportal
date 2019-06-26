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
import {UserState} from '../../../models/user-state.model';

@Component({
  selector: 'app-micro-app-renderer',
  templateUrl: './micro-app-renderer.component.html',
  styleUrls: ['./micro-app-renderer.component.scss']
})
export class MicroAppRendererComponent extends Renderer implements OnInit, OnDestroy, AfterViewInit {

  private _app: App;
  @Input('app')
  get app(): App {
    return this._app;
  }
  set app(app: App) {
    this.clearApp();
    this._app = app;
    if (this.isInitialized) {
      this.load();
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
    }
  }

  ngOnDestroy() {
    if (this.userSessionSub) {
      this.userSessionSub.unsubscribe();
    }
  }

  private clearApp(): void {
    if (this.customElem) {
      this.customElem.remove();
    }
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

  load(): void {
    let container = document.getElementById(this.containerId);
    this.customElem = this.buildCustomElement(this.app.appTag);
    this.setupElementIO();
    container.appendChild(this.customElem);
    const script = this.buildThirdPartyScriptTag(this.authSvc.globalConfig.appsServiceConnection, this.app, this.app.appBootstrap);
    if (!this.scriptExists(script.src)) {
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
    this.attachInitCallbackListener();
    this.attachHttpRequestListener();
    this.attachHttpAbortListener();
    this.attachUserStateCallbackListener();
  }

  protected attachInitCallbackListener(): void {
    this.customElem.addEventListener(CustomEventListeners.OnInitCallback, ($event: CustomEvent) => {
      if (this.isFunction($event.detail.callback)) {
        this.initCallback = $event.detail.callback;
        const userState: UserState = Cloner.cloneObject<UserState>(this.authSvc.userState);
        const coreServices: Object = this.authSvc.getCoreServicesMap();
        const state: Object = this.launchReqSvc.appStates.get(this.app.docId) || {};
        const baseUrl: string = UrlGenerator.generateAppResourceUrl(this.authSvc.globalConfig.appsServiceConnection, this.app);
        this.initCallback({
          userState: userState,
          coreServices: coreServices,
          state: state,
          baseUrl: baseUrl
        });
      }
    });
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
        this.userStateCallback(Cloner.cloneObject<UserState>(this.authSvc.userState));
      }
    });
  }

}
