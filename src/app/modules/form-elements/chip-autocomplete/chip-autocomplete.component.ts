import {
  Component,
  ViewChild,
  ElementRef,
  Input,
  SimpleChanges,
  OnDestroy,
  OnChanges
} from "@angular/core";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import {
  MatChipInputEvent,
  MatAutocompleteSelectedEvent,
  MatAutocomplete
} from "@angular/material";
import { FormControl } from "@angular/forms";
import { Observable, Subscription } from "rxjs";
import { startWith, map } from "rxjs/operators";

import { CustomFormElement } from "../custom-form-element";
import { KeyValue } from "../../../models/key-value.model";

@Component({
  selector: "app-chip-autocomplete",
  templateUrl: "./chip-autocomplete.component.html",
  styleUrls: ["./chip-autocomplete.component.scss"]
})
export class ChipAutocompleteComponent extends CustomFormElement
  implements OnChanges, OnDestroy {
  @Input() options: KeyValue[] = [];
  separatorKeysCodes = [ENTER, COMMA];
  inputCtrl = new FormControl();
  filteredOptions: Observable<KeyValue[]>;
  selectedOptions: KeyValue[] = [];

  @ViewChild("input") inputElement: ElementRef<HTMLInputElement>;
  @ViewChild("auto") matAutocomplete: MatAutocomplete;

  valueChangesSub: Subscription;

  constructor() {
    super();

    this.filteredOptions = this.inputCtrl.valueChanges.pipe(
      startWith(null),
      map((inputVal: string | KeyValue | null) =>
        inputVal ? this._filter(inputVal) : this.options.slice()
      )
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.formGroup && changes.options && changes.options.currentValue) {
      const values: string[] = this.formGroup.value[this.controlName];
      this.selectedOptions = values
        .map(v => changes.options.currentValue.find(opt => opt.value === v))
        .filter(opt => Boolean(opt));
    }
  }

  ngOnDestroy() {
    if (this.valueChangesSub) {
      this.valueChangesSub.unsubscribe();
    }
  }

  remove(i) {
    this.selectedOptions.splice(i, 1);
    this.formGroup.patchValue({
      [this.controlName]: this.selectedOptions.map(opt => opt.value)
    });
  }

  add(event: MatChipInputEvent): void {
    // Add app only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const inputVal = event.value ? event.value.trim() : "";
      const opt = this.options.find(opt => opt.display === inputVal);

      // Add our app
      if (opt) {
        this.selectedOptions.push(opt);
        this.formGroup.patchValue({
          [this.controlName]: this.selectedOptions.map(opt => opt.value)
        });
      }

      // Reset the input value
      if (input) {
        input.value = "";
      }

      this.inputCtrl.setValue(null);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.selectedOptions.push(event.option.value);
    this.inputElement.nativeElement.value = "";
    this.inputCtrl.setValue(null);
    this.formGroup.patchValue({
      [this.controlName]: this.selectedOptions.map(opt => opt.value)
    });
  }

  private _filter(value: string | KeyValue): KeyValue[] {
    let filterValue = "";
    if ((value as KeyValue).display) {
      filterValue = (value as KeyValue).display.toLowerCase();
    } else {
      filterValue = (value as string).toLowerCase();
    }

    return this.options.filter(
      opt => opt.display.toLowerCase().indexOf(filterValue) === 0
    );
  }
}
