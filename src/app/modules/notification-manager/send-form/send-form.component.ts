import { Component, OnInit, ViewChild } from '@angular/core';
import {CustomForm} from '../../../base-classes/custom-form';
import {FormControl, Validators, FormBuilder} from '@angular/forms';
import {KeyValue} from '../../../models/key-value.model';
import {Priority} from '../../../models/system-notification.model';
import {Role} from '../../../models/role.model';
import {UserProfile} from '../../../models/user-profile.model';

@Component({
  selector: 'app-send-form',
  templateUrl: './send-form.component.html',
  styleUrls: ['./send-form.component.scss']
})
export class SendFormComponent extends CustomForm implements OnInit {

  priorities: Array<KeyValue>;
  roleNames: Array<string>;

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
  }

  ngOnInit() {
    this.buildForm();
  }

  rolesUpdated(roleNames: Array<string>): void {
    this.roleNames = roleNames;
  }

  protected buildForm(): void {
    this.form = this.formBuilder.group({
      subject: new FormControl('', [Validators.maxLength(250), Validators.required]),
      message: new FormControl('', [Validators.maxLength(500), Validators.required]),
      priority: new FormControl("4")
    });
  }

}
