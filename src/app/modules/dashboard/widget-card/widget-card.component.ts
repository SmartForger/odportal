import { Component, OnInit, AfterViewInit, Input, Output, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import { Widget } from 'src/app/models/widget.model';
import { Renderer } from '../../app-renderers/renderer';
import { AuthService } from 'src/app/services/auth.service';
import { App } from 'src/app/models/app.model';

@Component({
  selector: 'app-widget-card',
  templateUrl: './widget-card.component.html',
  styleUrls: ['./widget-card.component.scss']
})
export class WidgetCardComponent extends Renderer implements OnInit, AfterViewInit {
  @Input() app: App;
  @Input() widgetTitle: string;
  @Input() inEditMode: boolean;
  @ViewChild('hook', {read: ElementRef}) widgetHook: ElementRef;
  @Output() remove: EventEmitter<string>;
  widget: Widget;

  constructor(private authSvc: AuthService) { 
    super();

    this.remove = new EventEmitter();
  }

  ngOnInit(){
    this.instantiateWidgetModel();
  }

  ngAfterViewInit(){
    this.isInitialized = true;
    if (!this.started && this.widget && !this.previewMode) {
      this.load();
    }
  }

  load(){
    let container = document.getElementById(this.containerId);
    /*
    this.script = this.buildScriptTag(
      this.authSvc.globalConfig.appsServiceConnection, 
      this.app.vendorId, 
      this.app.clientName, 
      this.app.version, 
      this.widget.widgetBootstrap);
    this.script.onload = () => {
    */
      this.customElem = this.buildCustomElement(this.widget.widgetTag);
      container.appendChild(this.customElem);
      this.started = true;
    /*
    };
    container.appendChild(this.script);
    */
  }

  removeWidget(){
    this.remove.emit(this.widgetTitle);
  }

  private instantiateWidgetModel(): void{
    let widgetFound = false;
    if(this.app.widgets){
      let i = 0;
      while(!widgetFound){
        if(this.widgetTitle == this.app.widgets[i].widgetTitle){
          this.widget = this.app.widgets[i];
          widgetFound = true;
        }
        else{
          i++;
        }
      }
    }
    
    if(!widgetFound){
      this.widget = null;
      console.log("Error: App '" + this.app.appTitle + "' contains no widget '" + this.widgetTitle + "'.")
    }
  }
}
