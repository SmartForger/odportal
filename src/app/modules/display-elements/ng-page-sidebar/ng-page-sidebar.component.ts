import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { ListItemIcon } from "src/app/models/list-item-icon.model";

@Component({
  selector: "ng-page-sidebar",
  templateUrl: "./ng-page-sidebar.component.html",
  styleUrls: ["./ng-page-sidebar.component.scss"]
})
export class NgPageSidebarComponent implements OnInit {
  @Input() items: ListItemIcon[];
  @Input() active: string;

  @Output() itemClick: EventEmitter<string>;

  constructor() {
    this.items = [];
    this.itemClick = new EventEmitter<string>();
  }

  ngOnInit() {
    this.active = this.items[0] ? this.items[0].value : "";
  }
}
