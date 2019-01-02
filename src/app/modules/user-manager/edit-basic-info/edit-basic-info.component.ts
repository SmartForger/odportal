import { Component, OnInit, Input } from '@angular/core';
import {CustomForm} from '../../../base-classes/custom-form';
import {UserProfile} from '../../../models/user-profile.model';
import {FormBuilder, Validators, FormControl} from '@angular/forms';
import {UsersService} from '../../../services/users.service';
import {SettableForm} from '../../../interfaces/settable-form';

@Component({
  selector: 'app-edit-basic-info',
  templateUrl: './edit-basic-info.component.html',
  styleUrls: ['./edit-basic-info.component.scss']
})
export class EditBasicInfoComponent extends CustomForm implements OnInit, SettableForm {

  user: UserProfile;

  constructor(
    private formBuilder: FormBuilder, 
    private usersSvc: UsersService) { 
    super();
  }

  ngOnInit() {
    this.buildForm();
  }

  setForm(user: UserProfile): void {
    this.user = user;
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

  submitForm(user: UserProfile): void {
    user.id = this.user.id;
    this.usersSvc.updateProfile(user).subscribe(
      (response: any) => {
        this.user.firstName = user.firstName;
        this.user.lastName = user.lastName;
        this.user.email = user.email;
        this.usersSvc.userUpdated(this.user);
      },
      (err: any) => {
        console.log(err);
      }
    );
    
  }

}
