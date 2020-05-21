import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-compatibility-details',
  templateUrl: './compatibility-details.component.html',
  styleUrls: ['./compatibility-details.component.scss']
})
export class CompatibilityDetailsComponent implements OnInit {
  @Input() data: any = {};
  @Output() close: EventEmitter<any>;

  constructor() {
    this.close = new EventEmitter();
  }

  ngOnInit() {
  }

}
