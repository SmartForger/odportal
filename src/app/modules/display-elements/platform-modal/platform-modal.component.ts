import { Component, OnInit, Input, Inject } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import {
  PlatformModalType,
  PlatformModalModel
} from "../../../models/platform-modal.model";
import { PlatformFormField } from "../../../models/platform-form-field.model";

@Component({
  selector: "app-platform-modal",
  templateUrl: "./platform-modal.component.html",
  styleUrls: ["./platform-modal.component.scss"]
})
export class PlatformModalComponent implements OnInit {
  formGroup: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dlgRef: MatDialogRef<PlatformModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PlatformModalModel
  ) {
    const formShape: any = {};
    this.data.formFields.forEach(field => {
      if (field.type !== "static") {
        formShape[field.name] = field.validators
          ? [field.defaultValue, field.validators]
          : [field.defaultValue];
      }
    });

    this.formGroup = this.fb.group(formShape);
    this.dlgRef.addPanelClass("platform-modal");
    this.dlgRef.addPanelClass(data.type || PlatformModalType.PRIMARY);
  }

  ngOnInit() {}

  submit() {
    if (this.formGroup.valid) {
      this.dlgRef.close(this.formGroup.value);
    }
  }
}
