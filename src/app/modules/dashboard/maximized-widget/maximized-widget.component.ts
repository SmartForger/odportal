import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Widget } from 'src/app/models/widget.model';
import { App } from 'src/app/models/app.model';
import { WidgetRendererFormat } from 'src/app/models/widget-renderer-format.model';

@Component({
  selector: 'app-maximized-widget',
  templateUrl: './maximized-widget.component.html',
  styleUrls: ['./maximized-widget.component.scss']
})
export class MaximizedWidgetComponent implements OnInit {

  @Input() app: App;
  @Input() widget: Widget;

  @Output() minimize: EventEmitter<null>;

  rendererFormat: WidgetRendererFormat

  constructor() { 
    this.minimize = new EventEmitter();

    this.rendererFormat = {
      cardClass: 'gridster-card-view-mode',
      greenBtnClass: 'disabledBtn', yellowBtnClass: 'yellowMinimizeBtn', redBtnClass: 'disabledBtn',
      greenBtnDisabled: true, yellowBtnDisabled: false, redBtndisabeld: true
    };
  }

  ngOnInit() {
  }

  stateChanged(state: string){
    this.widget.state = state;
  }
}
