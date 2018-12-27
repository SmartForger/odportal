import { Component, OnInit } from '@angular/core';
import {FilterBase} from '../filter-base';

@Component({
  selector: 'app-basic-string-filter',
  templateUrl: './basic-string-filter.component.html',
  styleUrls: ['./basic-string-filter.component.scss']
})
export class BasicStringFilterComponent extends FilterBase<string> implements OnInit {

  constructor() {
    super();
  }

  ngOnInit() {
  }

  submitSearch(): void {
    this.searchUpdated.emit(this.search);
  }

}
