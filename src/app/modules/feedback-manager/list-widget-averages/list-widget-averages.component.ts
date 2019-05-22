import { Component, OnInit, OnDestroy } from '@angular/core';
import { FeedbackWidgetService } from 'src/app/services/feedback-widget.service';
import { BreadcrumbsService } from '../../display-elements/breadcrumbs.service';
import { App } from 'src/app/models/app.model';
import { WidgetFeedback, AverageRating } from 'src/app/models/feedback-widget.model';
import { Subscription, forkJoin, Observable } from 'rxjs';
import { AppsService } from 'src/app/services/apps.service';

@Component({
  selector: 'app-list-widget-averages',
  templateUrl: './list-widget-averages.component.html',
  styleUrls: ['./list-widget-averages.component.scss']
})
export class ListWidgetAveragesComponent implements OnInit, OnDestroy {

  cacheSub: Subscription;
  models: Array<{app: App, averages: Array<AverageRating>}>;

  constructor(
    private appSvc: AppsService,
    private widgetFeedbackSvc: FeedbackWidgetService, 
    private crumbsSvc: BreadcrumbsService) { 
      this.models = new Array<{app: App, averages: Array<AverageRating>}>();
  }

  ngOnInit() {
    this.subscribeToAppCache();
  }

  ngOnDestroy() {
    this.cacheSub.unsubscribe();
  }

  getWidgetTitle(widgetId: string): string{
    let widgetIndex: number = 0;
    let widget = this.models.find((m) => {
      widgetIndex = m.app.widgets.findIndex((w) => w.docId === widgetId);
      return widgetIndex !== -1;
    });
    return widget.app.widgets[widgetIndex].widgetTitle;
  }

  private subscribeToAppCache(): void{
    this.cacheSub = this.appSvc.observeLocalAppCache()
    .subscribe((apps: Array<App>) => {
      this.diffApps(apps);
    });
  }

  private async diffApps(apps: Array<App>){
    apps.sort((a: App, b: App) => {
      let titleA = a.appTitle.toLowerCase();
      let titleB = b.appTitle.toLowerCase();
      return (titleA < titleB ? -1 : (titleA > titleB ? 1 : 0));
    });

    let temp = new Array<{app: App, averages: Array<AverageRating>}>();
    for(let appsIndex = 0; appsIndex < apps.length; appsIndex++){
      if(apps[appsIndex].widgets){
        let modelsIndex = this.models.findIndex((m) => m.app.docId === apps[appsIndex].docId);
        if(modelsIndex !== -1){
          temp.push(this.models[modelsIndex]);
          this.models.splice(modelsIndex, 1);
        }
        else{
          let widgetAverages = new Array<AverageRating>();
          for(let i = 0; i < apps[appsIndex].widgets.length; i++){
            let avg: AverageRating;
            try{
              avg = await this.widgetFeedbackSvc.fetchWidgetAverage(apps[appsIndex].widgets[i].docId).toPromise();
              console.log(`Found Avg!`);
              console.log(avg);
              widgetAverages.push(avg);
            }
            catch(e){
              console.error(e);
            }
          }
          console.log(widgetAverages);
          temp.push({app: apps[appsIndex], averages: widgetAverages});
          console.log(temp);
        }
      }
    }
    this.models = temp;
  }
}
