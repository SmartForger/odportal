import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {Breadcrumb} from '../breadcrumb.model';
import {BreadcrumbsService} from '../breadcrumbs.service';
import {Observable} from 'rxjs';
import { KeyValue } from '../../../models/key-value.model';
import { ListItemIcon } from '../../../models/list-item-icon.model';

@Component({
  selector: 'app-page-title',
  templateUrl: './page-title.component.html',
  styleUrls: ['./page-title.component.scss']
})
export class PageTitleComponent implements OnInit {

  crumbs: Observable<Array<Breadcrumb>>;

  @Input() pageTitle: string;
  @Input() backLink: Array<string>;

  @Input() showStatus: boolean;
  @Input() statusDisabled: boolean;
  @Input() statusOptions: Array<KeyValue>;
  @Output() statusChange: EventEmitter<string>;

  _status: string;
  get status() {
    return this._status;
  }
  @Input('status')
  set status(value: string) {
    this._status = value;
  }

  @Input() showMoreMenu: boolean;
  @Input() moreMenuItems: Array<ListItemIcon>;
  @Input() moreMenuClick: EventEmitter<string>;

  constructor(private crumbsSvc: BreadcrumbsService) { 
    this.pageTitle = "";
    this.backLink = [];
    this.showStatus = false;
    this.statusOptions = [];
    this.statusDisabled = false;
    this.statusChange = new EventEmitter<string>();
    this.showMoreMenu = false;
    this.moreMenuItems = [];
    this.moreMenuClick = new EventEmitter<string>();
  }

  ngOnInit() {
    this.subscribeToCrumbUpdates();
  }

  private subscribeToCrumbUpdates(): void {
    this.crumbs = this.crumbsSvc.breadcrumbUpdatedSub.asObservable();
  }

}
