/**
 * @description Lists vendor pending apps and displays them in a table
 * @author Steven M. Redman
 */

import { Component, OnInit, Input } from '@angular/core';
import {App} from '../../../models/app.model';

@Component({
  selector: 'app-list-apps-pending',
  templateUrl: './list-apps-pending.component.html',
  styleUrls: ['./list-apps-pending.component.scss']
})
export class ListAppsPendingComponent implements OnInit {

  @Input() apps: Array<App>;

  constructor() { 
    this.apps = new Array<App>();
  }

  ngOnInit() {
  }

}
