import { Component, OnInit, OnDestroy } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {UserProfile} from '../../../models/user-profile.model';
import {UsersService} from '../../../services/users.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit, OnDestroy {

  activeUserId: string;
  user: UserProfile;
  private userSub: Subscription;

  constructor(private route: ActivatedRoute, private usersSvc: UsersService) { }

  ngOnInit() {
    this.activeUserId = this.route.snapshot.params['id'];
    this.subscribeToUserUpdate();
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

  private subscribeToUserUpdate(): void {
    this.userSub = this.usersSvc.userSubject.subscribe(
      (user: UserProfile) => {
        this.user = user;
      }
    );
  }

}