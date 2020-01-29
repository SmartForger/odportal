import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ListItemIcon } from 'src/app/models/list-item-icon.model';

@Component({
  selector: 'ng-page-tabs',
  templateUrl: './ng-page-tabs.component.html',
  styleUrls: ['./ng-page-tabs.component.scss']
})
export class NgPageTabsComponent implements OnInit {
  @Input() tabs: ListItemIcon[];
  @Output() change: EventEmitter<string>;
  
  activeTab: string;

  constructor() {
    this.change = new EventEmitter<string>();
    this.tabs = [];
  }

  ngOnInit() {
    this.activeTab = this.tabs[0] ? this.tabs[0].value : '';
  }

  select(tab: string): void {
    this.change.emit(tab);
    this.activeTab = tab;
  }
}
