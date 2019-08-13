import { Component, OnInit, Input } from '@angular/core';
import {Chart} from 'angular-highcharts';
import { SeriesLineOptions } from 'highcharts';
import {TotalNotifications, Priority} from '../../../models/system-notification.model';

@Component({
  selector: 'app-traffic-chart',
  templateUrl: './traffic-chart.component.html',
  styleUrls: ['./traffic-chart.component.scss']
})
export class TrafficChartComponent implements OnInit {

  chart: Chart;

  private _data: Array<TotalNotifications>;
  @Input('data')
  get data(): Array<TotalNotifications> {
    return this._data;
  }
  set data(data: Array<TotalNotifications>) {
    this._data = data;
    this.buildChart();
  }

  constructor() { }

  ngOnInit() {
  }

  private buildChart(): void {
    const labels: Array<string> = this.buildLabels(this.data);
    const series: Array<SeriesLineOptions> = this.buildSeries(labels, this.data);
    this.chart = new Chart({
      chart: {
        type: 'line'
      },
      title: {
        text: 'Totals by Day and Priority'
      },
      credits: {
        enabled: false
      },
      yAxis: {
        title: {
          text: 'Total Notifications'
        }
      },
      xAxis: {
        title: {
          text: 'Day'
        },
        categories: labels
      },
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle'
      },
      series: series
    });
  }

  private buildLabels(data: Array<TotalNotifications>): Array<string> {
    let dates: Set<string> = new Set<string>();
    data.forEach((point: TotalNotifications) => {
      dates.add(point.date);
    });
    return Array.from(dates);
  }

  private buildSeries(dates: Array<string>, data: Array<TotalNotifications>): Array<SeriesLineOptions> {
    let critSeries = new Array<number>();
    let hpSeries = new Array<number>();
    let lpSeries = new Array<number>();
    let passiveSeries = new Array<number>();
    dates.forEach((date: string) => {
      const critPoint: TotalNotifications = data.find((point: TotalNotifications) => point.date === date && point.priority === Priority.Critical);
      critSeries.push(critPoint ? critPoint.total : 0);
      const hpPoint: TotalNotifications = data.find((point: TotalNotifications) => point.date === date && point.priority === Priority.HighPriority);
      hpSeries.push(hpPoint ? hpPoint.total : 0);
      const lpPoint: TotalNotifications = data.find((point: TotalNotifications) => point.date === date && point.priority === Priority.LowPriority);
      lpSeries.push(lpPoint ? lpPoint.total : 0);
      const passivePoint: TotalNotifications = data.find((point: TotalNotifications) => point.date === date && point.priority === Priority.Passive);
      passiveSeries.push(passivePoint ? passivePoint.total : 0);
    });
    return new Array<SeriesLineOptions>(
      {
        name: 'Critical',
        type: 'line',
        data: critSeries,
        color: 'red'
      },
      {
        name: 'High-Priority',
        type: 'line',
        data: hpSeries,
        color: 'orange'
      },
      {
        name: 'Low-Priority',
        type: 'line',
        data: lpSeries,
        color: 'green'
      },
      {
        name: 'Passive',
        type: 'line',
        data: passiveSeries,
        color: 'blue'
      }
    );
  }

}
