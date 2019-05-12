import {
  Component,
  ViewEncapsulation,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef
} from "@angular/core";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import {
  MatChipInputEvent,
  MatAutocompleteSelectedEvent,
  MatAutocomplete
} from "@angular/material";
import { FormControl } from "@angular/forms";
import { Observable } from "rxjs";
import { startWith, map } from "rxjs/operators";

@Component({
  selector: "app-event-chips",
  templateUrl: "./event-chips.component.html",
  styleUrls: ["./event-chips.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class EventChipsComponent {
  @Input() placeholder = "Event";
  @Input() events = [];
  @Input() options = [];
  @Output() optionsChanged = new EventEmitter<string[]>();
  @ViewChild("input") input: ElementRef<HTMLInputElement>;
  @ViewChild("auto") matAutocomplete: MatAutocomplete;

  optionsCtrl = new FormControl();
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  filteredOptions: Observable<string[]>;

  constructor() {
    this.filteredOptions = this.optionsCtrl.valueChanges.pipe(
      startWith(null),
      map((inputVal: string | null) => this._filter(inputVal))
    );
  }

  add(event: MatChipInputEvent): void {
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      if ((value || "").trim()) {
        this.events.push(value.trim());
        this.optionsChanged.emit(this.events);
      }

      if (input) {
        input.value = "";
      }

      this.optionsCtrl.setValue(null);
    }
  }

  remove(listener: string): void {
    const index = this.events.indexOf(listener);

    if (index >= 0) {
      this.events.splice(index, 1);
      this.optionsChanged.emit(this.events);
    }
  }

  handleFocus() {
    this.input.nativeElement.value = "";
    this.optionsCtrl.setValue("");
  }

  select(ev: MatAutocompleteSelectedEvent) {
    this.optionsChanged.emit([...this.events, ev.option.value]);
    this.input.nativeElement.value = "";
    this.optionsCtrl.setValue("");
  }

  private _filter(value: string | null): string[] {
    if (!value) {
      return this.options.filter(opt => this.events.indexOf(opt) < 0);
    }

    const filterValue = value.toLowerCase();

    return this.options.filter(
      opt =>
        this.events.indexOf(opt) < 0 &&
        opt.toLowerCase().indexOf(filterValue) === 0
    );
  }
}
