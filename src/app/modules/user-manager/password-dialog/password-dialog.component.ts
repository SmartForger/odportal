import { Component, OnInit, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators, FormControl, FormGroupDirective, NgForm } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA, ErrorStateMatcher } from "@angular/material";
import { PlatformModalType } from "src/app/models/platform-modal.model";
import { CredentialsRepresentation } from "src/app/models/credentials-representation.model";
import { UsersService } from "src/app/services/users.service";
import { NotificationService } from "src/app/notifier/notification.service";
import { NotificationType } from "src/app/notifier/notificiation.model";

export class ConfirmPasswordStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
    const confirmed = !!(control && control.parent && control.parent.errors && control.parent.errors.confirmPassword && control.parent.dirty);

    return (invalidCtrl || confirmed);
  }
}

@Component({
  selector: "app-password-dialog",
  templateUrl: "./password-dialog.component.html",
  styleUrls: ["./password-dialog.component.scss"],
})
export class PasswordDialogComponent implements OnInit {
  formGroup: FormGroup;
  loading: boolean;
  matcher = new ConfirmPasswordStateMatcher()

  constructor(
    private dlgRef: MatDialogRef<PasswordDialogComponent>,
    private fb: FormBuilder,
    private usersSvc: UsersService,
    private notificationSvc: NotificationService,
    @Inject(MAT_DIALOG_DATA) public userId: string
  ) {
    this.dlgRef.addPanelClass("platform-modal");
    this.dlgRef.addPanelClass(PlatformModalType.PRIMARY);

    this.formGroup = this.fb.group(
      {
        password: ["", Validators.compose([
          Validators.required,
          Validators.minLength(8)
        ])],
        confirmPassword: [""],
      },
      {
        validator: this.checkPasswords,
      }
    );
  }

  ngOnInit() {}

  checkPasswords(group: FormGroup) {
    let pass = group.get("password").value;
    let confirmPass = group.get("confirmPassword").value;

    return pass === confirmPass ? null : { confirmPassword: true };
  }

  changePassword(): void {
    if (this.formGroup.valid) {
      this.loading = true;
      const creds: CredentialsRepresentation = {
        type: "password",
        value: this.formGroup.value.password,
        temporary: false,
      };
      this.usersSvc.updatePassword(this.userId, creds).subscribe(
        () => {
          this.notificationSvc.notify({
            type: NotificationType.Success,
            message: "The password was updated successfully",
          });
          this.loading = false;
          this.dlgRef.close();
        },
        () => {
          this.notificationSvc.notify({
            type: NotificationType.Error,
            message: "There was a problem while updaing the password",
          });
          this.loading = false;
          this.dlgRef.close();
        }
      );
    }
  }
}
