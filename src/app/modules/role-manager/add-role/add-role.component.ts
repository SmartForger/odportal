import { Component, OnInit } from "@angular/core";
import { FormControl, Validators, FormBuilder } from "@angular/forms";
import { CustomForm } from "../../../base-classes/custom-form";
import { Role } from "../../../models/role.model";
import { SettableForm } from "../../../interfaces/settable-form";
import { MatDialogRef } from '@angular/material';
import { PlatformModalType } from "src/app/models/platform-modal.model";

@Component({
  selector: "app-add-role",
  templateUrl: "./add-role.component.html",
  styleUrls: ["./add-role.component.scss"]
})
export class AddRoleComponent extends CustomForm
  implements OnInit, SettableForm {
  constructor(
    private formBuilder: FormBuilder,
    private dlgRef: MatDialogRef<AddRoleComponent>
  )
  {
    super();
    this.dlgRef.addPanelClass('platform-modal');
    this.dlgRef.addPanelClass(PlatformModalType.PRIMARY);
  }

  ngOnInit() {
    this.buildForm();
  }

  setForm(role: Role): void {
    this.form.setValue({
      name: role.name,
      description: role.description || ""
    });
  }

  protected buildForm(): void {
    this.form = this.formBuilder.group({
      name: new FormControl("", [
        Validators.required,
        Validators.maxLength(250)
      ]),
      description: new FormControl("", [
        Validators.required,
        Validators.maxLength(1000)
      ])
    });
  }

  submitForm(role: Role): void {
    if (this.form.valid) {
      this.formSubmitted.emit(role);
    }
  }
}
