import { Component, OnInit } from '@angular/core';
import { FeedbackWidgetService } from 'src/app/services/feedback-widget.service';
import { WidgetGroupAvgRating } from 'src/app/models/feedback-widget.model';

@Component({
  selector: 'app-list-widget-averages',
  templateUrl: './list-widget-averages.component.html',
  styleUrls: ['./list-widget-averages.component.scss']
})
export class ListWidgetAveragesComponent implements OnInit {

  widgetGroups: Array<WidgetGroupAvgRating>;

  constructor(
    private widgetFeedbackSvc: FeedbackWidgetService) { 
      this.widgetGroups = new Array<WidgetGroupAvgRating>();
    }   

  ngOnInit() {
    this.listWidgetAverages();
  }

  private listWidgetAverages(): void {
    this.widgetFeedbackSvc.listGroupAverages().subscribe(
      (groups: Array<WidgetGroupAvgRating>) => {
        this.widgetGroups = groups;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }
  
}
