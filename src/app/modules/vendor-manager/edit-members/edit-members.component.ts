import { Component, OnInit, Input, ViewChild } from '@angular/core';
import {VendorsService} from '../../../services/vendors.service';
import {Vendor} from '../../../models/vendor.model';
import {UserProfile} from '../../../models/user-profile.model';
import {NotificationService} from '../../../notifier/notification.service';
import {NotificationType} from '../../../notifier/notificiation.model';
import { MatDialog, MatDialogRef } from '@angular/material';
import { AddMemberComponent } from '../add-member/add-member.component';
import { PlatformModalComponent } from '../../display-elements/platform-modal/platform-modal.component';
import { PlatformModalType } from 'src/app/models/platform-modal.model';

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

    let dialogRef: MatDialogRef<PlatformModalComponent> = this.dialog.open(PlatformModalComponent, {
      data: {
        type: PlatformModalType.SECONDARY,
        title: "Remove Member",
        subtitle: "Are you sure you want to remove this member?",
        submitButtonTitle: "Remove",
        submitButtonClass: "bg-red",
        formFields: [
          {
            type: "static",
            label: "Username",
            defaultValue: this.activeUser.username
          },
          {
            type: "static",
            label: "Full Name",
            defaultValue: `${this.activeUser.firstName} ${this.activeUser.lastName}`
          }
        ]
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if(data){
        this.deleteConfirmed();
      }
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
