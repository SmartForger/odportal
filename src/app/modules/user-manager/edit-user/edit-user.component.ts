import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {UserProfile} from '../../../models/user-profile.model';
import {UsersService} from '../../../services/users.service';
import {Subscription} from 'rxjs';
import {EditBasicInfoComponent} from '../edit-basic-info/edit-basic-info.component';
import {AjaxProgressService} from '../../../ajax-progress/ajax-progress.service';
import {ModalComponent} from '../../display-elements/modal/modal.component';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit, OnDestroy {

  user: UserProfile;
  private userSub: Subscription;

  @ViewChild(EditBasicInfoComponent) private basicInfo: EditBasicInfoComponent;
  @ViewChild('deleteModal') private deleteModal: ModalComponent;
  @ViewChild('enableModal') private enableModal: ModalComponent;
  @ViewChild('disableModal') private disableModal: ModalComponent;

  constructor(
    private route: ActivatedRoute, 
    private usersSvc: UsersService,
    private ajaxSvc: AjaxProgressService) { }

  ngOnInit() {
    this.fetchUser();
    this.subscribeToUserUpdates();
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

  enableButtonClicked(enable: boolean): void {
    this.showEnableOrDisableModal(enable);
  }

  enableConfirmed(btnText: string, enable: boolean): void {
    this.ajaxSvc.show();
    this.hideEnableOrDisableModal(enable);
    this.user.enabled = enable;
    this.usersSvc.updateProfile(this.user).subscribe(
      (response: any) => {
        this.ajaxSvc.hide();
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  private showEnableOrDisableModal(enable: boolean): void {
    if (enable) {
      this.enableModal.show = true;
    }
    else {
      this.disableModal.show = true;
    }
  }

  private hideEnableOrDisableModal(enable: boolean): void {
    if (enable) {
      this.enableModal.show = false;
    }
    else {
      this.disableModal.show = false;
    }
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

  private subscribeToUserUpdates(): void {
    this.userSub = this.usersSvc.userSubject.subscribe(
      (user: UserProfile) => {
        this.user = user;
      }
    );
  }

}