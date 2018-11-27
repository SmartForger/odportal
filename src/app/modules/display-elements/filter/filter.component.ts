import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {

  @Input() filterTitle: string;
  @Input() filterTitleClassList: string;
  @Input() searchbarPlaceholderText: string;
  @Input() sortClassList: string;
  @Input() options: Array<Object>;

  @Output() filterSubmit: EventEmitter<string>;

  filterFormGroup = new FormGroup({
    search: new FormControl(),
    sort: new FormControl()
  });


  constructor() { 
    this.filterTitle="";
    this.filterTitleClassList="filter-title";
    this.searchbarPlaceholderText="";
    this.sortClassList="";

    this.filterSubmit = new EventEmitter();
  }

  ngOnInit() {
  }

  onSubmit(): void{
    this.filterSubmit.emit(this.filterFormGroup.value);
  }
}
