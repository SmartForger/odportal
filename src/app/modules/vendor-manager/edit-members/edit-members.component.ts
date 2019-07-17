import { Component, OnInit, Input, ViewChild } from '@angular/core';
import {VendorsService} from '../../../services/vendors.service';
import {Vendor} from '../../../models/vendor.model';
import {UserProfile} from '../../../models/user-profile.model';
import {NotificationService} from '../../../notifier/notification.service';
import {NotificationType} from '../../../notifier/notificiation.model';
import {ConfirmModalComponent} from '../../display-elements/confirm-modal/confirm-modal.component';
import { MatDialog, MatDialogRef } from '@angular/material';
import { AddMemberComponent } from '../add-member/add-member.component';

@Component({
  selector: 'app-edit-members',
  templateUrl: './edit-members.component.html',
  styleUrls: ['./edit-members.component.scss']
})
export class EditMembersComponent implements OnInit {

  activeUser: UserProfile;

  @Input() vendor: Vendor;
  @Input() canUpdate: boolean;

  constructor(
    private vendorsSvc: VendorsService, 
    private notifySvc: NotificationService,
    private dialog: MatDialog) {
      this.canUpdate = false;
    }

  ngOnInit() {
  }

  addButtonClicked(): void {
    this.dialog.open(AddMemberComponent, {
      data: this.vendor
    });

    // modalRef.afterOpened().subscribe(open => {
    //   modalRef.componentInstance.users = this.users;
    //   modalRef.componentInstance.vendorName = this.vendor.name;
    // });

    // modalRef.componentInstance.addUser.subscribe(user => this.addUser(user.user, user.index));
    // modalRef.componentInstance.close.subscribe(close => modalRef.close());
  }

  deleteUser(user: UserProfile): void {
    this.activeUser = user;

    let modalRef: MatDialogRef<ConfirmModalComponent> = this.dialog.open(ConfirmModalComponent, {

    });

    modalRef.componentInstance.title = 'Remove Member';
    modalRef.componentInstance.message = 'Are you sure you want to remove ' + this.activeUser.firstName + ' ' + this.activeUser.lastName + '?';
    modalRef.componentInstance.icons = [{icon: 'person_outline', classList: ''}];
    modalRef.componentInstance.buttons = [{title: 'Remove', classList: 'bg-red'}];

    modalRef.componentInstance.btnClick.subscribe(btnClick => {
      if(btnClick === 'Remove'){
        this.deleteConfirmed();
      }
      modalRef.close();
    });
  }

  deleteConfirmed(): void {
    const index: number = this.vendor.users.findIndex((u: UserProfile) => u.id === this.activeUser.id);
    this.vendor.users.splice(index, 1);
    this.vendorsSvc.updateVendor(this.vendor).subscribe(
      (vendor: Vendor) => {
        this.notifySvc.notify({
          type: NotificationType.Success,
          message: `${this.activeUser.firstName} ${this.activeUser.lastName} was removed successfully`
        });
      },
      (err: any) => {
        console.log(err);
        this.vendor.users.splice(index, 0, this.activeUser);
        this.notifySvc.notify({
          type: NotificationType.Error,
          message: `There was a problem while removing ${this.activeUser.firstName} ${this.activeUser.lastName}`
        });
      }
    );
  }
}
