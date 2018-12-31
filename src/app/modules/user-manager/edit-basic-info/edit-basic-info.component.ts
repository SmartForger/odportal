import { Component, OnInit, Input } from '@angular/core';
import {CustomForm} from '../../../base-classes/custom-form';
import {UserProfile} from '../../../models/user-profile.model';
import {FormBuilder, Validators, FormControl} from '@angular/forms';
import {UsersService} from '../../../services/users.service';
import {SettableForm} from '../../../interfaces/settable-form';
import {AjaxProgressService} from '../../../ajax-progress/ajax-progress.service';

@Component({
  selector: 'app-edit-basic-info',
  templateUrl: './edit-basic-info.component.html',
  styleUrls: ['./edit-basic-info.component.scss']
})
export class EditBasicInfoComponent extends CustomForm implements OnInit, SettableForm {

  @Input() activeUserId: string;

  constructor(
    private formBuilder: FormBuilder, 
    private usersSvc: UsersService,
    private ajaxSvc: AjaxProgressService) { 
    super();
  }

  ngOnInit() {
    this.buildForm();
    this.fetchUser();
  }

  setForm(user: UserProfile): void {
    this.form.setValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    });
  }

  protected buildForm(): void {
    this.form = this.formBuilder.group({
      firstName: new FormControl('', [Validators.required, Validators.maxLength(250)]),
      lastName: new FormControl('', [Validators.required, Validators.maxLength(250)]),
      email: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(254)])
    });
  }

  private fetchUser(): void {
    this.ajaxSvc.show();
    this.usersSvc.fetchById(this.activeUserId).subscribe(
      (user: UserProfile) => {
        this.setForm(user);
        this.ajaxSvc.hide();
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  submitForm(user: UserProfile): void {
    user.id = this.activeUserId;
    this.ajaxSvc.show();
    this.usersSvc.update(user).subscribe(
      (response: any) => {
        this.ajaxSvc.hide();
        this.usersSvc.userUpdated(user);
      },
      (err: any) => {
        console.log(err);
      }
    );
    
  }

}
