/**
 * @description Lists pending apps and displays an icon representing whether each is enables/disabled
 * @author Steven M. Redman
 */

import { Component, OnInit, Input } from '@angular/core';
import {App} from '../../../models/app.model';

@Component({
  selector: 'app-list-pending-apps',
  templateUrl: './list-pending-apps.component.html',
  styleUrls: ['./list-pending-apps.component.scss']
})
export class ListPendingAppsComponent implements OnInit {

  @Input() apps: Array<App>;

  constructor() { 
    this.apps = new Array<App>();
  }

  ngOnInit() {
  }

}
