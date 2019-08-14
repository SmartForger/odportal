import { Component, OnInit, Input } from '@angular/core';
import {TotalNotifications, Priority} from '../../../models/system-notification.model';

@Component({
  selector: 'app-total-notifications-table',
  templateUrl: './total-notifications-table.component.html',
  styleUrls: ['./total-notifications-table.component.scss']
})
export class TotalNotificationsTableComponent implements OnInit {

  private _data: Array<TotalNotifications>;
  @Input('data')
  get data(): Array<TotalNotifications> {
    return this._data;
  }
  set data(data: Array<TotalNotifications>) {
    this._data = data;
  }

  constructor() { }

  ngOnInit() {
  }

  getCellData(priority: Priority): number {
    const point: TotalNotifications = this.data.find((point: TotalNotifications) => point.priority === priority);
    return point ? point.total : 0;
  }

}
