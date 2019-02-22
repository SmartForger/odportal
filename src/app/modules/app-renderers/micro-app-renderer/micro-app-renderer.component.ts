import { Component, OnInit, AfterViewInit, OnDestroy, Input } from '@angular/core';
import {App} from '../../../models/app.model';
import {AuthService} from '../../../services/auth.service';
import {Renderer} from '../renderer';

@Component({
  selector: 'app-micro-app-renderer',
  templateUrl: './micro-app-renderer.component.html',
  styleUrls: ['./micro-app-renderer.component.scss']
})
export class MicroAppRendererComponent extends Renderer implements OnInit, OnDestroy, AfterViewInit {

  @Input() app: App;

  constructor(private authSvc: AuthService) { 
    super();
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    if (!this.previewMode) {
      this.load();
    }
  }

  ngOnDestroy() {
    this.destroy();
  }

  protected load(): void {
    let container = document.getElementById(this.containerId);
    this.script = this.buildScriptTag(
      this.authSvc.globalConfig.appsServiceConnection, 
      this.app.vendorId, 
      this.app.clientName, 
      this.app.version, 
      this.app.appBootstrap);
    this.script.onload = () => {
      this.customElem = this.buildCustomElement(this.app.appTag);
      container.appendChild(this.customElem);
    };
    container.appendChild(this.script);
  }

}
