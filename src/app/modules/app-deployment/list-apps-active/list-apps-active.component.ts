import { Component, OnInit, Input } from '@angular/core';
import {App} from '../../../models/app.model';

@Component({
  selector: 'app-list-apps-active',
  templateUrl: './list-apps-active.component.html',
  styleUrls: ['./list-apps-active.component.scss']
})
export class ListAppsActiveComponent implements OnInit {

  @Input() apps: Array<App>;

  constructor() { 
    this.apps = new Array<App>();
  }

  ngOnInit() {
  }

}
