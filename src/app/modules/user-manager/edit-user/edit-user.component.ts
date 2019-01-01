import { Component, OnInit, ViewChild } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {UserProfile} from '../../../models/user-profile.model';
import {UsersService} from '../../../services/users.service';
import {Subscription} from 'rxjs';
import {EditBasicInfoComponent} from '../edit-basic-info/edit-basic-info.component';
import {AjaxProgressService} from '../../../ajax-progress/ajax-progress.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {

  user: UserProfile;
  private userSub: Subscription;

  @ViewChild(EditBasicInfoComponent) private basicInfo: EditBasicInfoComponent;

  constructor(
    private route: ActivatedRoute, 
    private usersSvc: UsersService,
    private ajaxSvc: AjaxProgressService) { }

  ngOnInit() {
    this.fetchUser();
  }

  private fetchUser(): void {
    this.ajaxSvc.show();
    this.usersSvc.fetchById(this.route.snapshot.params['id']).subscribe(
      (user: UserProfile) => {
        this.ajaxSvc.hide();
        this.user = user;
        this.basicInfo.setForm(user);
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

}