import { Component, OnInit, Input, ViewChild } from '@angular/core';
import {VendorsService} from '../../../services/vendors.service';
import {UsersService} from '../../../services/users.service';
import {Vendor} from '../../../models/vendor.model';
import {UserProfile} from '../../../models/user-profile.model';
import {UserSearch} from '../../../models/user-search.model';
import {NotificationService} from '../../../notifier/notification.service';
import {NotificationType} from '../../../notifier/notificiation.model';
import {ModalComponent} from '../../display-elements/modal/modal.component';

@Component({
  selector: 'app-edit-members',
  templateUrl: './edit-members.component.html',
  styleUrls: ['./edit-members.component.scss']
})
export class EditMembersComponent implements OnInit {

  showAdd: boolean;
  userSearch: UserSearch;
  users: Array<UserProfile>;
  activeUser: UserProfile;

  @Input() vendor: Vendor;
  @Input() canUpdate: boolean;

  @ViewChild('deleteModal') deleteModal: ModalComponent;

  constructor(
    private vendorsSvc: VendorsService, 
    private usersSvc: UsersService,
    private notifySvc: NotificationService) { 
      this.showAdd = false;
      this.userSearch = {
        search: ""
      };
      this.users = new Array<UserProfile>();
      this.canUpdate = false;
    }

  ngOnInit() {
  }

  addButtonClicked(): void {
    this.fetchUsers();
    this.showAdd = true;
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

  deleteUser(user: UserProfile): void {
    this.activeUser = user;
    this.deleteModal.show = true;
  }

  deleteConfirmed(btnText: string): void {
    this.deleteModal.show = false;
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

  private fetchUsers(): void {
    this.usersSvc.listUsers(this.userSearch).subscribe(
      (users: Array<UserProfile>) => {
        this.users = users;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

}
