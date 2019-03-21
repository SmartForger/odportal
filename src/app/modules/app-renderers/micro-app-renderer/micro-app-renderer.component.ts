import { Component, OnInit, OnDestroy, Input, AfterViewInit } from '@angular/core';
import {App} from '../../../models/app.model';
import {AuthService} from '../../../services/auth.service';
import {Renderer} from '../renderer';
import { ApiRequest } from 'src/app/models/api-request.model';
import {HttpRequestControllerService} from '../../../services/http-request-controller.service';

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
    if (!this.previewMode && this.isInitialized) {
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
    if (!this.started && this.app && !this.previewMode) {
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
    this.script = this.buildScriptTag(
      this.authSvc.globalConfig.appsServiceConnection, 
      this.app.vendorId, 
      this.app.clientName, 
      this.app.version, 
      this.app.appBootstrap);
    this.script.onload = () => {
      this.customElem = this.buildCustomElement(this.app.appTag, this.authSvc.userState);
      this.attachHttpRequestListener();
      container.appendChild(this.customElem);
      this.started = true;
    };
    container.appendChild(this.script);
  }

  protected attachHttpRequestListener(): void {
    this.customElem.addEventListener(this.HTTP_REQUEST_EVENT, ($event: CustomEvent) => {
      let request: ApiRequest = $event.detail;
      request.appId = this.app.docId;
      this.httpControllerSvc.send(request);
    });
  }

}
