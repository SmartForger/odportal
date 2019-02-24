import { Component, OnInit, Input } from '@angular/core';
import {App} from '../../../models/app.model';

@Component({
  selector: 'app-widget-previewer',
  templateUrl: './widget-previewer.component.html',
  styleUrls: ['./widget-previewer.component.scss']
})
export class WidgetPreviewerComponent implements OnInit {

  @Input() app: App;

  constructor() { 
  }

  ngOnInit() {
  }

}
