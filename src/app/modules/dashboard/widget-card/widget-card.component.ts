import { Component, AfterViewInit, Input, Output, ViewChild, ElementRef, Renderer2, EventEmitter } from '@angular/core';
import { App } from 'src/app/models/app.model';

@Component({
  selector: 'app-widget-card',
  templateUrl: './widget-card.component.html',
  styleUrls: ['./widget-card.component.scss']
})
export class WidgetCardComponent implements AfterViewInit {
  @Input() app: App;
  @Input() inEditMode: boolean;
  @Input() index: number;
  @ViewChild('hook', {read: ElementRef}) widgetHook: ElementRef;
  @Output() remove: EventEmitter<number>;

  constructor(private renderer: Renderer2) { 
    this.inEditMode = false;
    this.remove = new EventEmitter();
  }

  ngAfterViewInit(){
    //const widgetElement = document.createElement(this.app.appTag);
    const widgetElement: ElementRef = this.renderer.createElement(this.app.appTag);
    this.renderer.appendChild(this.widgetHook.nativeElement, widgetElement);
  }

  removeWidget(){
    this.remove.emit(this.index);
  }
}
