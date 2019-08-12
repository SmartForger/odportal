import { Component, OnInit, ViewChild } from '@angular/core';
import {CustomForm} from '../../../base-classes/custom-form';
import {FormControl, Validators, FormBuilder} from '@angular/forms';
import {KeyValue} from '../../../models/key-value.model';
import {Priority} from '../../../models/system-notification.model';
import {SystemNotification, IconType} from '../../../models/system-notification.model';

@Component({
  selector: 'app-send-form',
  templateUrl: './send-form.component.html',
  styleUrls: ['./send-form.component.scss']
})
export class SendFormComponent extends CustomForm implements OnInit {

  priorities: Array<KeyValue>;
  roleNames: Array<string>;
  userIds: Array<string>;

  constructor(
    private formBuilder: FormBuilder) { 
    super();
    this.priorities = new Array<KeyValue>(
      {
        display: "Critical",
        value: Priority.Critical.toString()
      },
      {
        display: "High-Priority",
        value: Priority.HighPriority.toString()
      },
      {
        display: "Low-Priority",
        value: Priority.LowPriority.toString()
      },
      {
        display: "Passive",
        value: Priority.Passive.toString()
      }
    );
    this.roleNames = new Array<string>();
    this.userIds = new Array<string>();
  }

  ngOnInit() {
    this.buildForm();
  }

  rolesUpdated(roleNames: Array<string>): void {
    this.roleNames = roleNames;
  }

  usersUpdated(userIds: Array<string>): void {
    this.userIds = userIds;
  }

  protected buildForm(): void {
    this.form = this.formBuilder.group({
      subject: new FormControl('', [Validators.maxLength(250), Validators.required]),
      message: new FormControl('', [Validators.maxLength(500), Validators.required]),
      priority: new FormControl("4")
    });
  }

  submitForm(formData: {subject: string, message: string, priority: string}): void {
    const notification: SystemNotification = {
      subject: formData.subject,
      message: formData.message,
      priority: parseInt(formData.priority),
      target: {
        users: this.userIds,
        roles: this.roleNames
      },
      icon: {
        type: IconType.Icon,
        source: "notification_important"
      }
    };
    this.formSubmitted.emit(notification);
  }

}
