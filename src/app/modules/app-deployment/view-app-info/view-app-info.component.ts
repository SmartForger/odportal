import { Component, OnInit, Input } from '@angular/core';
import {App} from '../../../models/app.model';

@Component({
  selector: 'app-view-app-info',
  templateUrl: './view-app-info.component.html',
  styleUrls: ['./view-app-info.component.scss']
})
export class ViewAppInfoComponent implements OnInit {

  @Input() app: App;

  constructor() { }

  ngOnInit() {
  }

}
