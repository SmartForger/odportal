import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {UserProfileKeycloak} from '../../../models/user-profile.model';

@Component({
  selector: 'app-view-attributes',
  templateUrl: './view-attributes.component.html',
  styleUrls: ['./view-attributes.component.scss']
})
export class ViewAttributesComponent implements OnInit {

  @Input() user: UserProfileKeycloak;
  @Output() close: EventEmitter<null>;

  constructor() { 
    this.close = new EventEmitter();
  }

  ngOnInit() {
  }

}
