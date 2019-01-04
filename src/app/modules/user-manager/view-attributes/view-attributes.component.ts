import { Component, OnInit, Input } from '@angular/core';
import {UserProfile} from '../../../models/user-profile.model';

@Component({
  selector: 'app-view-attributes',
  templateUrl: './view-attributes.component.html',
  styleUrls: ['./view-attributes.component.scss']
})
export class ViewAttributesComponent implements OnInit {

  @Input() user: UserProfile;

  constructor() { }

  ngOnInit() {
  }

}
