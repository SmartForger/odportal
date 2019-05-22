import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
  SimpleChanges
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { Observable } from "rxjs";
import { startWith, map } from "rxjs/operators";
import { MatAutocompleteSelectedEvent } from "@angular/material";
import { FilterOption } from "../../../models/filter-option";

@Component({
  selector: "app-filter-field",
  templateUrl: "./filter-field.component.html",
  styleUrls: ["./filter-field.component.scss"]
})
export class FilterFieldComponent implements OnInit {
  @Input() value: string = "";
  @Input() options: FilterOption[] = [];
  @Input() placeholder: string = "";
  @Output() valueChange: EventEmitter<string>;

  @ViewChild("input") input: ElementRef<HTMLInputElement>;

  myControl: FormControl;
  filteredOptions: Observable<FilterOption[]>;

  constructor() {
    this.valueChange = new EventEmitter<string>();
    this.myControl = new FormControl();

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(""),
      map(value => this._filter(value))
    );
  }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.options && changes.options.currentValue) {
      const option = changes.options.currentValue[0];
      if (typeof option === "string") {
        this.options = changes.options.currentValue.map(opt => ({
          label: opt,
          value: opt
        }));
      } else {
        this.options = changes.options.currentValue;
      }
    }

    if (changes.options || changes.value) {
      const v = changes.value ? changes.value.currentValue : "";
      const option = this.options.find(opt => opt.value === v);
      this.myControl.setValue(option ? option.label : "");
    }
  }

  optionSelected(ev: MatAutocompleteSelectedEvent) {
    this.valueChange.emit(ev.option.value);
  }

  handleFocus() {
    this.myControl.setValue("");
  }

  closed() {
    const option = this.options.find(opt => opt.value === this.value);
    this.myControl.setValue(option ? option.label : "");
  }

  private _filter(value: string): FilterOption[] {
    const filterValue = value ? value.toLowerCase() : "";
    return this.options.filter(option =>
      option.label.toLowerCase().includes(filterValue)
    );
  }
}
