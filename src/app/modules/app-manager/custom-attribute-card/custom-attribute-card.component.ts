import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  SimpleChanges
} from "@angular/core";
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
  @Input() allApps: KeyValue[] = [];
  @Output() remove = new EventEmitter();

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
