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
    if (this.isInitialized) {
      this.load();
    }
  }
  
  constructor(private authSvc: AuthService) { 
    super();
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.isInitialized = true;
    if (!this.started && this.widget) {
      this.load();
    }
  }

  ngOnDestroy() {
    this.destroy();
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
      this.customElem = this.buildCustomElement(this.widget.widgetTag);
      container.appendChild(this.customElem);
      this.started = true;
    };
    container.appendChild(this.script);
  }

}