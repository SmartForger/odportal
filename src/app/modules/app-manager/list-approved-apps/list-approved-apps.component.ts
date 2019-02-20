import { Component, OnInit, Input } from '@angular/core';
import {App} from '../../../models/app.model';

@Component({
  selector: 'app-list-approved-apps',
  templateUrl: './list-approved-apps.component.html',
  styleUrls: ['./list-approved-apps.component.scss']
})
export class ListApprovedAppsComponent implements OnInit {

  @Input() apps: Array<App>;

  constructor() { 
    this.apps = new Array<App>();
  }

  ngOnInit() {
  }

}
