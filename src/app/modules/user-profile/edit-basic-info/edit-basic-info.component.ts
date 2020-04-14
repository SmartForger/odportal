import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormControl } from "@angular/forms";

import { CustomForm } from "../../../base-classes/custom-form";
import { UserProfileKeycloak } from "../../../models/user-profile.model";
import { UsersService } from "../../../services/users.service";
import { SettableForm } from "../../../interfaces/settable-form";
import { NotificationService } from "../../../notifier/notification.service";
import { NotificationType } from "../../../notifier/notificiation.model";
import { AuthService } from "../../../services/auth.service";

@Component({
  selector: "app-edit-basic-info",
  templateUrl: "./edit-basic-info.component.html",
  styleUrls: ["./edit-basic-info.component.scss"]
})
export class EditBasicInfoComponent extends CustomForm
  implements OnInit, SettableForm {
  user: UserProfileKeycloak;

  constructor(
    private formBuilder: FormBuilder,
    private usersSvc: UsersService,
    private notificationSvc: NotificationService,
    private authSvc: AuthService
  ) {
    super();
  }

  ngOnInit() {
    this.buildForm();
  }

  setForm(user: UserProfileKeycloak): void {
    this.user = user;
    this.form.setValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email || ''
    });
  }

  protected buildForm(): void {
    this.form = this.formBuilder.group({
      firstName: new FormControl("", [
        Validators.required,
        Validators.maxLength(250)
      ]),
      lastName: new FormControl("", [
        Validators.required,
        Validators.maxLength(250)
      ]),
      email: new FormControl("", [
        Validators.required,
        Validators.email,
        Validators.maxLength(254)
      ])
    });
  }

  submitForm(user: UserProfileKeycloak): void {
    if(this.form.valid){
      user.id = this.user.id;
      this.usersSvc.updateProfile(user).subscribe(
        (response: any) => {
          this.user.firstName = user.firstName;
          this.user.lastName = user.lastName;
          this.user.email = user.email || '';
          this.pushUserUpdate(this.user);
          this.notificationSvc.notify({
            type: NotificationType.Success,
            message: this.user.username + " was updated successfully"
          });
        },
        (err: any) => {
          this.notificationSvc.notify({
            type: NotificationType.Error,
            message: "There was a problem while updating " + this.user.username
          });
        }
      );
    }
  }

  private pushUserUpdate(user: UserProfileKeycloak): void {
    if (user.id === this.authSvc.getUserId()) {
      this.authSvc.updateUserSession(true);
    }
  }
}
