import { Component, OnInit, OnDestroy, Input, AfterViewInit } from '@angular/core';
import {Widget} from '../../../models/widget.model';
import {App} from '../../../models/app.model';
import {AuthService} from '../../../services/auth.service';
import {Renderer} from '../renderer';

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
  
  constructor(private authSvc: AuthService) { 
    super();
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
    this.script = this.buildScriptTag(
      this.authSvc.globalConfig.appsServiceConnection, 
      this.app.vendorId, 
      this.app.clientName, 
      this.app.version, 
      this.widget.widgetBootstrap);
    this.script.onload = () => {
      this.customElem = this.buildCustomElement(this.widget.widgetTag, this.authSvc.userState);
      container.appendChild(this.customElem);
      this.started = true;
    };
    container.appendChild(this.script);
  }

}
