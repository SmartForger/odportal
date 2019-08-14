import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import {SystemNotificationsService} from '../../../services/system-notifications.service';
import {TotalNotifications} from '../../../models/system-notification.model';


@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {

  startDate: Date;
  endDate: Date;
  tableData: Array<TotalNotifications>;
  chartData: Array<TotalNotifications>;

  constructor(private snSvc: SystemNotificationsService) { 
    this.startDate = new Date();
    this.endDate = new Date();
  }

  ngOnInit() {
    this.getData();
  }

  getData(): void {
    const startDateStr: string = moment(this.startDate).subtract(1, 'days').format('YYYY-MM-DD');
    const endDateStr: string = moment(this.endDate).add(1, 'days').format('YYYY-MM-DD');
    this.getTotalNotifications(startDateStr, endDateStr);
    this.getTotalDailyNotifications(startDateStr, endDateStr);
  }

  private getTotalNotifications(startDate: string, endDate: string): void {
    this.snSvc.getTotalNotifications(startDate, endDate).subscribe(
      (data: Array<TotalNotifications>) => {
        this.tableData = data;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  private getTotalDailyNotifications(startDate: string, endDate: string): void {
    this.snSvc.getTotalDailyNotifications(startDate, endDate).subscribe(
      (data: Array<TotalNotifications>) => {
        this.chartData = data;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

}