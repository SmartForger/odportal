import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { Observable } from "rxjs";
import { startWith, map } from "rxjs/operators";
import { MatAutocompleteSelectedEvent } from "@angular/material";

@Component({
  selector: "app-filter-field",
  templateUrl: "./filter-field.component.html",
  styleUrls: ["./filter-field.component.scss"]
})
export class FilterFieldComponent implements OnInit {
  @Input() value: string = "";
  @Input() options: string[] = [];
  @Input() placeholder: string = "";
  @Output() valueChange: EventEmitter<string>;

  @ViewChild("input") input: ElementRef<HTMLInputElement>;

  myControl: FormControl;
  filteredOptions: Observable<string[]>;

  constructor() {
    this.valueChange = new EventEmitter<string>();
    this.myControl = new FormControl();

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(""),
      map(value => this._filter(value))
    );
  }

  ngOnInit() {}

  optionSelected(ev: MatAutocompleteSelectedEvent) {
    this.input.nativeElement.value = ev.option.value;
    this.valueChange.emit(ev.option.value);
  }

  handleFocus() {
    this.input.nativeElement.value = "";
    this.myControl.setValue("");
  }

  closed() {
    if (this.options.indexOf(this.input.nativeElement.value) < 0) {
      this.input.nativeElement.value = this.value || "";
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option =>
      option.toLowerCase().includes(filterValue)
    );
  }
}
