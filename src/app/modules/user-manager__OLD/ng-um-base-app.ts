import { OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { UserProfileKeycloak } from 'src/app/models/user-profile.model';

export class NgUmBaseApp implements OnInit, OnChanges {
  @Input() user: UserProfileKeycloak;

  constructor() {
    this.user = {
      firstName: '',
      lastName: '',
      username: '',
      email: ''
    };
  }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.user && changes.user.currentValue) {
      this.user = changes.user.currentValue;
    }
  }

}
