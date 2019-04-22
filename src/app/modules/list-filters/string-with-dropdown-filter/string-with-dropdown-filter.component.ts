import { Component, OnInit, Input } from '@angular/core';
import {FilterBase} from '../filter-base';
import {StringWithDropdown} from '../string-with-dropdown.model';
import {KeyValueGen} from '../../../interfaces/key-value-gen';
import {KeyValue} from '../../../models/key-value.model';

@Component({
  selector: 'app-string-with-dropdown-filter',
  templateUrl: './string-with-dropdown-filter.component.html',
  styleUrls: ['./string-with-dropdown-filter.component.scss']
})
export class StringWithDropdownFilterComponent extends FilterBase<StringWithDropdown> implements OnInit {

  @Input() dropdownLabelText: string;
  @Input() dropdownGen: KeyValueGen;
  @Input() dropdownOptions: Array<KeyValue>;
  @Input() selectedItem: string;

  constructor() { 
    super();
    this.dropdownOptions = new Array<KeyValue>();
    this.selectedItem = "";
  }

  ngOnInit() {
    if (this.dropdownGen) {
      this.populateDropdown();
    }
  }

  submitSearch(): void {
    this.searchUpdated.emit({queryValue: this.search, dropdownValue: this.selectedItem});
  }

  private populateDropdown(): void {
    this.dropdownGen.generateKeyValues().subscribe(
      (kv: Array<KeyValue>) => {
        this.dropdownOptions = kv;
      }
    );
  }

}
