import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { UserProfile } from '../../../models/user-profile.model';
import { UsersService } from '../../../services/users.service';
import { VendorsService } from '../../../services/vendors.service';
import { Vendor } from '../../../models/vendor.model';
import { NotificationType } from '../../../notifier/notificiation.model';
import { NotificationService } from '../../../notifier/notification.service';
import { UserSearch } from '../../../models/user-search.model';

@Component({
  selector: 'app-add-member',
  templateUrl: './add-member.component.html',
  styleUrls: ['./add-member.component.scss']
})
export class AddMemberComponent {

  vendorName: string;
  users: Array<UserProfile>;
  userSearch: UserSearch;

  constructor(
    private usersSvc: UsersService,
    private vendorsSvc: VendorsService, 
    private notifySvc: NotificationService,
    @Inject(MAT_DIALOG_DATA) public vendor: Vendor,
    public dialogRef: MatDialogRef<AddMemberComponent>
  ) { 
    this.vendorName = '';
    this.userSearch = {
      search: ""
    };
    this.users = [];
    this.fetchUsers();
  }

  addUser(user: UserProfile, index: number): void {
    const u: UserProfile = this.vendor.users.find((u: UserProfile) => u.id === user.id);
    if (!u) {
      const addedUser: UserProfile = this.createUserObject(user);
      this.vendor.users.push(addedUser);
      this.vendorsSvc.updateVendor(this.vendor).subscribe(
        (vendor: Vendor) => {
          this.users.splice(index, 1);
          this.notifyAddSuccess(addedUser);
        },
        (err: any) => {
          console.log(err);
          this.vendor.users.pop();
          this.notifySvc.notify({
            type: NotificationType.Error,
            message: `There was a problem while adding the ${addedUser.firstName} ${addedUser.lastName}`
          });
        }
      );
    }
    else {
      this.users.splice(index, 1);
      this.notifyAddSuccess(user);
    }
  }

  private fetchUsers(): void {
    this.usersSvc.listUsers(this.userSearch).subscribe(
      (users: Array<UserProfile>) => {
        const vendorUsers = this.vendor.users.map((u: UserProfile) => u.id);
        this.users = users.filter((u: UserProfile) => vendorUsers.indexOf(u.id) < 0);
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  private createUserObject(user: UserProfile): UserProfile {
    return {
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      id: user.id
    };
  }

  private notifyAddSuccess(user: UserProfile): void {
    this.notifySvc.notify({
      type: NotificationType.Success,
      message: `${user.firstName} ${user.lastName} was added successfully`
    });
  }

}
