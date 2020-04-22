import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter
} from "@angular/core";
import { ENTER, COMMA } from "@angular/cdk/keycodes";
import {
  MatAutocomplete,
  MatChipInputEvent,
  MatAutocompleteSelectedEvent,
  MatFormField
} from "@angular/material";
import { FormControl, FormGroup } from "@angular/forms";
import { Observable } from "rxjs";
import { startWith, map } from "rxjs/operators";

@Component({
  selector: "ng-chips-autocomplete",
  templateUrl: "./ng-chips-autocomplete.component.html",
  styleUrls: ["./ng-chips-autocomplete.component.scss"]
})
export class NgChipsAutocompleteComponent implements OnInit {
  @Input() items: Array<string>;
  @Input() options: Array<string>;
  @Input() placeholder: string;
  @Output() itemsChange: EventEmitter<string[]>;

  @Input() form: FormGroup;
  get controlName() {
    return this._controlName;
  }
  @Input() set controlName(name: string) {
    this._controlName = name;
    if (this.form && name) {
      const control = this.form.get(name);

      if (control && control.value && control.value.length > 0) {
        this.items = control.value;
      }
    }
  }

  @ViewChild("itemsInput") itemsInput: ElementRef<HTMLInputElement>;
  @ViewChild("auto") matAutocomplete: MatAutocomplete;
  @ViewChild('formField') matFormField: MatFormField;

  separatorKeysCodes: number[] = [ENTER, COMMA];
  itemsCtrl = new FormControl();
  filteredItems: Observable<string[]>;
  _controlName: string = '';

  constructor() {
    this.items = [];
    this.options = [];
    this.placeholder = "";
    this.itemsChange = new EventEmitter<string[]>();

    this.filteredItems = this.itemsCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) =>
        fruit
          ? this._filter(fruit)
          : this.options.filter(item => this.items.indexOf(item) < 0)
      )
    );
  }

  ngOnInit() {}

  add(event: MatChipInputEvent): void {
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = (event.value || "").trim();

      if (value && this.items.indexOf(value) < 0) {
        this.setItems([...this.items, value]);
      }

      if (input) {
        input.value = "";
      }

      this.itemsCtrl.setValue(null);
    }
  }

  remove(item: string) {
    this.setItems(this.items.filter(_item => _item !== item));
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    if (this.items.indexOf(event.option.viewValue) < 0) {
      this.setItems([...this.items, event.option.viewValue]);
    }
    this.itemsInput.nativeElement.value = "";
    this.itemsCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(
      item =>
        item.toLowerCase().indexOf(filterValue) === 0 &&
        this.items.indexOf(item) < 0
    );
  }

  private setItems(items: string[]) {
    this.items = items;
    this.itemsChange.emit(items);

    if (this.form && this._controlName) {
      this.form.patchValue({
        [this._controlName]: items
      });
      this.form.get(this._controlName).markAsTouched();
    }
  }
}
