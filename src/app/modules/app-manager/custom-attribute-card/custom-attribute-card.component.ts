import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { KeyValue } from "../../../models/key-value.model";

@Component({
  selector: "app-custom-attribute-card",
  templateUrl: "./custom-attribute-card.component.html",
  styleUrls: ["./custom-attribute-card.component.scss"]
})
export class CustomAttributeCardComponent implements OnInit {
  @Input() info: CustomAttributeInfo = {
    name: "",
    token: "",
    endPoint: "",
    apps: []
  };
  @Output() remove = new EventEmitter();

  allApps: KeyValue[] = [
    {
      display: "User Manager",
      value: "user-manager"
    },
    {
      display: "Role Manager",
      value: "role-manager"
    },
    {
      display: "Mattermost",
      value: "mattermost"
    },
    {
      display: "User Profile",
      value: "user-profile"
    },
    {
      display: "MicroApp Manager",
      value: "microapp-manager"
    },
    {
      display: "Feedback Manager",
      value: "feedback-manager"
    }
  ];
  form: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    const formDef = {
      ...this.info,
      apps: [this.info.apps]
    };
    this.form = this.fb.group(formDef);
  }

  handleRemove() {
    this.remove.emit();
  }
}
