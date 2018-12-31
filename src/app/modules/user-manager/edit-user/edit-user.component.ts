import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {UserProfile} from '../../../models/user-profile.model';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {

  activeUserId: string;
  user: UserProfile;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.activeUserId = this.route.snapshot.params['id'];
  }

}