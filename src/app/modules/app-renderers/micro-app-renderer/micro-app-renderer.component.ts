import { Component, OnInit, OnDestroy, Input, AfterViewInit } from '@angular/core';
import {App} from '../../../models/app.model';
import {AuthService} from '../../../services/auth.service';
import {Renderer} from '../renderer';
import { ApiRequest } from 'src/app/models/api-request.model';
import {HttpRequestControllerService} from '../../../services/http-request-controller.service';
import {CustomEventListeners, AppWidgetAttributes} from '../../../util/constants';

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
    this._app = app;
    this.destroy();
    if (this.isInitialized) {
      this.load();
    }
  }

  constructor(
    private authSvc: AuthService,
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
    this.destroy();
    if (this.userSessionSub) {
      this.userSessionSub.unsubscribe();
    }
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
    this.setAttributeValue(AppWidgetAttributes.UserState, this.authSvc.userState);
    this.setAttributeValue(AppWidgetAttributes.CoreServiceConnections, JSON.stringify(this.authSvc.getCoreServicesMap()));
  }

  protected attachHttpRequestListener(): void {
    this.customElem.addEventListener(CustomEventListeners.HttpRequestEvent, ($event: CustomEvent) => {
      let request: ApiRequest = $event.detail;
      request.appId = this.app.docId;
      this.httpControllerSvc.send(request);
    });
  }

}
