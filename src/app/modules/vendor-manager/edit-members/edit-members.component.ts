import { Component, OnInit, Input, ViewChild } from '@angular/core';
import {VendorsService} from '../../../services/vendors.service';
import {Vendor} from '../../../models/vendor.model';
import {UserProfile} from '../../../models/user-profile.model';
import {NotificationService} from '../../../notifier/notification.service';
import {NotificationType} from '../../../notifier/notificiation.model';
import {ApiSearchCriteria} from '../../../models/api-search-criteria.model';
import {SSPList} from '../../../base-classes/ssp-list';
import { MatDialog, MatDialogRef } from '@angular/material';
import { PlatformModalComponent } from '../../display-elements/platform-modal/platform-modal.component';
import { PlatformModalType } from 'src/app/models/platform-modal.model';
import { TableSelectModalComponent } from '../../display-elements/table-select-modal/table-select-modal.component';
import { UsersService } from 'src/app/services/users.service';
import { mergeMap } from 'rxjs/operators';
import { of, forkJoin } from 'rxjs';

@Component({
  selector: 'app-edit-members',
  templateUrl: './edit-members.component.html',
  styleUrls: ['./edit-members.component.scss']
})
export class EditMembersComponent extends SSPList<UserProfile> implements OnInit {

  activeUser: UserProfile;

  @Input() vendor: Vendor;
  @Input() canUpdate: boolean;

  constructor(
    private vendorsSvc: VendorsService,
    private usersSvc: UsersService,
    private notifySvc: NotificationService,
    private dialog: MatDialog) {

      super(
        new Array<string>(
          "username", "fullname", "email", "actions"
        ),
        new ApiSearchCriteria(
          {username: ""}, 0, "name", "asc"
        )
      );
      this.canUpdate = false;
  }

  ngOnInit() {
    this.paginator.length = this.vendor.users.length;
  }

  addButtonClicked(): void {
    this.usersSvc.listUsers({})
      .pipe(
        mergeMap((users: Array<UserProfile>) => {
          const vendorUsers = this.vendor.users.map((u: UserProfile) => u.id);
          const modalRef: MatDialogRef<TableSelectModalComponent> = this.dialog.open(
            TableSelectModalComponent,
            {
              data: {
                searchPlaceholder: 'Search users',
                buttonLabel: 'Add users to role',
                title: 'Add Users to ' + this.vendor.name,
                columns: ['username', 'fullname'],
                data: users.filter(u => vendorUsers.indexOf(u.id) < 0),
                filterFunc: (search: string, item: any) =>
                  item.username.toLowerCase().indexOf(search) >= 0 ||
                  `${item.firstName} ${item.lastName}`.toLowerCase().indexOf(search) >= 0
              }
            }
          );
          return modalRef.afterClosed();
        }),
        mergeMap((selectedData: any) => {
          if (selectedData && selectedData.length > 0) {
            this.vendor.users = [
              ...this.vendor.users,
              ...selectedData.map(u => ({
                firstName: u.firstName,
                lastName: u.lastName,
                username: u.username,
                email: u.email || '',
                id: u.id
              }))
            ];
            this.paginator.length += 1;
            return this.vendorsSvc.updateVendor(this.vendor);
          }

          return of(null);
        })
      ).subscribe((vendor?: Vendor) => {
        if (vendor) {
          this.notifySvc.notify({
            type: NotificationType.Success,
            message: 'Vendor users were updated successfully'
          });
        }
      });
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

  listItems(): void {
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
        this.paginator.length -= 1;
        this.notifySvc.notify({
          type: NotificationType.Error,
          message: `There was a problem while removing ${this.activeUser.firstName} ${this.activeUser.lastName}`
        });
      }
    );
  }
}
