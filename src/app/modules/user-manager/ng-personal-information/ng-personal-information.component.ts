import { Component, SimpleChanges } from '@angular/core';
import { NgUmBaseApp } from '../ng-um-base-app';

@Component({
  selector: 'ng-personal-information',
  templateUrl: './ng-personal-information.component.html',
  styleUrls: ['./ng-personal-information.component.scss']
})
export class NgPersonalInformationComponent extends NgUmBaseApp {
  fullname: string;

  constructor() {
    super();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.user && changes.user.currentValue) {
      this.user = changes.user.currentValue;
      this.fullname = this.user.firstName + ' ' + this.user.lastName;
    }
  }
}
