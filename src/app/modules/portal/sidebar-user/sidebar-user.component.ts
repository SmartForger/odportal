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
  avatarStyle: any;
  isOpenDashAdmin: boolean;
  roleTooltip: string;

  constructor(private authSvc: AuthService, private usersSvc: UsersService) { 
    this.profileError = false;
    this.isOpenDashAdmin = false;
  }

  ngOnInit() {
    this.loadUserProfile();
    this.subscribeToUserUpdates();

    this.avatarStyle = {
      fontWeight: 'bold',
      fontSize: '14px',
      lineHeight: '37px',
      height: '35px',
      width: '35px'
    };
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
      this.isOpenDashAdmin = this.authSvc.hasRealmRole('OpenDashAdmin');
      if (this.isOpenDashAdmin) {
        this.roleTooltip = 'OpenDash360 Administrator';
      } else {
        this.roleTooltip = `${profile.firstName} ${profile.lastName}`;
      }
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
