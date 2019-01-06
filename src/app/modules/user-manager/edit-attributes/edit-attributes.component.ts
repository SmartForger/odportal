import { Component, OnInit, Input, ViewChild } from '@angular/core';
import {UserProfile} from '../../../models/user-profile.model';
import {UsersService} from '../../../services/users.service';
import {KeyValue} from '../../../models/key-value.model';
import {NotificationService} from '../../../notifier/notification.service';
import {NotificationType} from '../../../notifier/notificiation.model';
import {CustomAttributeFormComponent} from '../custom-attribute-form/custom-attribute-form.component';

@Component({
  selector: 'app-edit-attributes',
  templateUrl: './edit-attributes.component.html',
  styleUrls: ['./edit-attributes.component.scss']
})
export class EditAttributesComponent implements OnInit {

  attrs: Array<KeyValue>;
  showAdd: boolean;
  showEdit: boolean;
  private disableUserUpdate: boolean;
  private activeAttr: KeyValue;

  private _user: UserProfile;
  @Input('user') 
  get user(): UserProfile {
    return this._user;
  }
  set user(user: UserProfile) {
    this._user = user;
    if (!this.disableUserUpdate) {
      this.attrs = new Array<KeyValue>();
      if (user) {
        this.generateForm();
      }
    }
  }

  @ViewChild('addAttrForm') private addAttrForm: CustomAttributeFormComponent;
  @ViewChild('editAttrForm') private editAttrForm: CustomAttributeFormComponent;

  constructor(private usersSvc: UsersService, private notificationSvc: NotificationService) { 
    this.attrs = new Array<KeyValue>();
    this.showAdd = false;
    this.showEdit = false;
    this.disableUserUpdate = false;
  }

  ngOnInit() {
  }

  update(): void {
    this.disableUserUpdate = true;
    this.user.attributes = {};
    this.attrs.forEach((attr: KeyValue) => {
      console.log(attr.value);
      this.user.attributes[attr.display] = new Array<string>(attr.value);
    });
    this.usersSvc.updateProfile(this.user).subscribe(
      (response: any) => {
        this.disableUserUpdate = false;
        this.notificationSvc.notify({
          type: NotificationType.Success,
          message: "The user's custom attributes were updated successfully"
        }); 
      },
      (err: any) => {
        this.disableUserUpdate = false;
        this.notificationSvc.notify({
          type: NotificationType.Error,
          message: "There was a problem while updating this users's custom attributes"
        }); 
      }
    );
  }

  add(): void {
    this.addAttrForm.clearForm();
    this.showAdd = true;
  }

  addAttribute(kv: KeyValue): void {
    this.showAdd = false;
    this.attrs.push({
      display: kv.display,
      value: kv.value
    });
  }

  edit(attr: KeyValue): void {
    this.activeAttr = attr;
    this.editAttrForm.setForm(attr);
    this.showEdit = true;
  }

  updateAttribute(attr: KeyValue): void {
    this.showEdit = false;
    this.activeAttr.display = attr.display;
    this.activeAttr.value = attr.value;
  }

  remove(attr: KeyValue): void {
    const index: number = this.attrs.indexOf(attr);
    this.attrs.splice(index, 1);
  }

  private generateForm(): void {
    for (let key in this.user.attributes) {
      this.attrs.push({
        display: key,
        value: this.user.attributes[key][0]
      });
    }
  }

}
