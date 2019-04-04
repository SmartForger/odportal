import { Component, Output, EventEmitter } from '@angular/core';
import { UserProfile } from 'src/app/models/user-profile.model';

@Component({
  selector: 'app-add-member',
  templateUrl: './add-member.component.html',
  styleUrls: ['./add-member.component.scss']
})
export class AddMemberComponent {

  vendorName: string;
  users: Array<UserProfile>;

  @Output() addUser: EventEmitter<{user: UserProfile, index: number}>;
  @Output() close: EventEmitter<null>;

  constructor() { 
    this.vendorName = '';
    this.addUser = new EventEmitter();
    this.close = new EventEmitter();
  }
}
