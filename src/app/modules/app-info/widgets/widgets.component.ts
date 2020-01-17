/**
 * @description Displays information about widgets that belong to the app
 * @author Steven M. Redman
 */

import { Component, OnInit, Input } from '@angular/core';
import {App} from '../../../models/app.model';
import {Widget} from '../../../models/widget.model';

@Component({
  selector: 'app-widgets',
  templateUrl: './widgets.component.html',
  styleUrls: ['./widgets.component.scss']
})
export class WidgetsComponent implements OnInit {

  @Input() app: App;
  widgets: Widget[];

  constructor() { }

  ngOnInit() {
      this.widgets = this.app.widgets;
  }

  search(searchString: string) {
      console.log(searchString);
      this.widgets = this.app.widgets.filter(w =>
          w.widgetTitle.toLowerCase().indexOf(searchString.toLowerCase()) >= 0
      );
  }
}
