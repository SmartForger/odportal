import { OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { UserProfile } from 'src/app/models/user-profile.model';

export class NgUmBaseApp implements OnInit, OnChanges {
  @Input() user: UserProfile;

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
