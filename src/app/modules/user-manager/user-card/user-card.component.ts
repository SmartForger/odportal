import { Component, OnInit, Input } from '@angular/core';

import { UserProfileKeycloak } from '../../../models/user-profile.model';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss']
})
export class UserCardComponent implements OnInit {
  @Input() user: UserProfileKeycloak;

  readonly AVATAR_STYLE = {
    fontSize: '30px',
    fontFamily: 'Roboto'
  };
  
  constructor() {
    this.user = {
      firstName: '',
      lastName: '',
      username: '',
      email: ''
    };
  }

  ngOnInit() {
  }

}
