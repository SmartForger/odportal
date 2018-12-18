import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {UserProfile} from '../../../models/user-profile.model';

@Component({
  selector: 'app-sidebar-user',
  templateUrl: './sidebar-user.component.html',
  styleUrls: ['./sidebar-user.component.scss']
})
export class SidebarUserComponent implements OnInit {

  profile: UserProfile;
  profileError: boolean;
  accountURL: string;

  constructor(private authSvc: AuthService) { 
    this.profileError = false;
  }

  ngOnInit() {
    this.loadUserProfile();
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

}
