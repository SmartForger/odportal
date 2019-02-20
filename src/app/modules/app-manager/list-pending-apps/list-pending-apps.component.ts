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
