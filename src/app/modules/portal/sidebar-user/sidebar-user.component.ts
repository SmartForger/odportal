import { Component, OnInit, OnDestroy } from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {UserProfile} from '../../../models/user-profile.model';
import {UsersService} from '../../../services/users.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-sidebar-user',
  templateUrl: './sidebar-user.component.html',
  styleUrls: ['./sidebar-user.component.scss']
})
export class SidebarUserComponent implements OnInit, OnDestroy {

  profile: UserProfile;
  profileError: boolean;
  accountURL: string;
  private userSub: Subscription;

  constructor(private authSvc: AuthService, private usersSvc: UsersService) { 
    this.profileError = false;
  }

  ngOnInit() {
    this.loadUserProfile();
    this.subscribeToUserUpdates();
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

  logout(): void {
    this.authSvc.logout();
  }

  private loadUserProfile(): void {
    this.authSvc.getUserProfile()
    .then((profile: UserProfile) => {
      this.profile = profile;
      this.accountURL = this.authSvc.getAccountURL();
    })
    .catch(() => {
      this.profileError = true;
    });
  }

  private subscribeToUserUpdates(): void {
    this.userSub = this.authSvc.observeUserSessionUpdates().subscribe((userId: string) => {
      if (userId === this.authSvc.getUserId()) {
        this.loadUserProfile();
      }
    });
  }

}
