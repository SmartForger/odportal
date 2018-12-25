import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-basic-string-filter',
  templateUrl: './basic-string-filter.component.html',
  styleUrls: ['./basic-string-filter.component.scss']
})
export class BasicStringFilterComponent implements OnInit {

  search: string;

  @Input() labelText: string;
  @Input() placeholderText: string;

  @Output() private searchUpdated: EventEmitter<string>;

  constructor() { 
    this.labelText = "";
    this.placeholderText = "";
    this.search = "";
    this.searchUpdated = new EventEmitter<string>();
  }

  ngOnInit() {
  }

  submitSearch(): void {
    this.searchUpdated.emit(this.search);
  }

}
