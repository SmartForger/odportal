import { Component, OnInit, Input, ViewChild } from '@angular/core';
import {UserProfile} from '../../../models/user-profile.model';
import {UsersService} from '../../../services/users.service';
import {KeyValue} from '../../../models/key-value.model';
import {NotificationService} from '../../../notifier/notification.service';
import {ApiSearchCriteria} from '../../../models/api-search-criteria.model';
import {SSPList} from '../../../base-classes/ssp-list';
import {NotificationType} from '../../../notifier/notificiation.model';
import {CustomAttributeFormComponent} from '../custom-attribute-form/custom-attribute-form.component';
import { MatDialog, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-edit-attributes',
  templateUrl: './edit-attributes.component.html',
  styleUrls: ['./edit-attributes.component.scss']
})
export class EditAttributesComponent extends SSPList<KeyValue> implements OnInit {

  attrs: Array<KeyValue>;
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

  private _canUpdate: boolean;
  @Input('canUpdate')
  get canUpdate(): boolean {
    return this._canUpdate;
  }
  set canUpdate(canUpdate: boolean) {
    this._canUpdate = canUpdate;
  }

  constructor(private usersSvc: UsersService, private notificationSvc: NotificationService, private dialog: MatDialog) { 
    super(
      new Array<string>(
        "key", "value", "actions"
      ),
      new ApiSearchCriteria(
        {key: ""}, 0, "key", "asc"
      )
    );
    this.attrs = new Array<KeyValue>();
    this.disableUserUpdate = false;
    this.canUpdate = true;
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
    let modalRef: MatDialogRef<CustomAttributeFormComponent> = this.dialog.open(CustomAttributeFormComponent, {

    });

    modalRef.afterOpened().subscribe(open => modalRef.componentInstance.clearForm());
    
    modalRef.componentInstance.formSubmitted.subscribe(newAttr => {
      this.addAttribute(newAttr);
      modalRef.close();
    });
    modalRef.componentInstance.close.subscribe((close) => modalRef.close());
  }

  addAttribute(kv: KeyValue): void {
    this.attrs.push({
      display: kv.display,
      value: kv.value
    });
    this.paginator.length += 1;
  }

  edit(attr: KeyValue): void {
    this.activeAttr = attr;

    let modalRef: MatDialogRef<CustomAttributeFormComponent> = this.dialog.open(CustomAttributeFormComponent, {

    });

    modalRef.afterOpened().subscribe(event => modalRef.componentInstance.setForm(attr));

    modalRef.componentInstance.formSubmitted.subscribe(updatedAttr => {
      this.updateAttribute(updatedAttr);
      modalRef.close();
    });
  }

  updateAttribute(attr: KeyValue): void {
    this.activeAttr.display = attr.display;
    this.activeAttr.value = attr.value;
  }

  remove(attr: KeyValue): void {
    const index: number = this.attrs.indexOf(attr);
    this.attrs.splice(index, 1);
    this.paginator.length -= 1;
  }

  private generateForm(): void {
    let attributesCount = 0;
    for (let key in this.user.attributes) {
      this.attrs.push({
        display: key,
        value: this.user.attributes[key][0]
      });
      attributesCount ++;
    }
    this.paginator.length = attributesCount;
  }

  listItems(): void {
  }

}
