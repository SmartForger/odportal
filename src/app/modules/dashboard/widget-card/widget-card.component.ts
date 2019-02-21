import { Component, AfterViewInit, Input, ViewChild, ElementRef, Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common'
import { App } from 'src/app/models/app.model';

@Component({
  selector: 'app-widget-card',
  templateUrl: './widget-card.component.html',
  styleUrls: ['./widget-card.component.scss']
})
export class WidgetCardComponent implements AfterViewInit {
  @Input() app: App;
  @ViewChild('hook', {read: ElementRef}) widgetHook: ElementRef;

  constructor(private renderer: Renderer2) { 
    
  }

  ngAfterViewInit(){
    //const widgetElement = document.createElement(this.app.appTag);
    const widgetElement: ElementRef = this.renderer.createElement(this.app.appTag);
    this.renderer.appendChild(this.widgetHook.nativeElement, widgetElement);
  }

}
