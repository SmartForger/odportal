import { Component, OnInit, Input } from '@angular/core';
import {App} from '../../../models/app.model';

@Component({
  selector: 'app-view-widgets',
  templateUrl: './view-widgets.component.html',
  styleUrls: ['./view-widgets.component.scss']
})
export class ViewWidgetsComponent implements OnInit {

  @Input() app: App;

  constructor() { }

  ngOnInit() {
  }

}
