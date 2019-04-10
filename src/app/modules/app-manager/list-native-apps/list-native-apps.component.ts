/**
 * @description Lists native apps and shows an icon representing if it is enabled/disabled
 * @author Steven M. Redman
 */

import { Component, OnInit, Input } from '@angular/core';
import {App} from '../../../models/app.model';

@Component({
  selector: 'app-list-native-apps',
  templateUrl: './list-native-apps.component.html',
  styleUrls: ['./list-native-apps.component.scss']
})
export class ListNativeAppsComponent implements OnInit {

  @Input() apps: Array<App>;

  constructor() { 
    this.apps = new Array<App>();
  }

  ngOnInit() {
  }

}
