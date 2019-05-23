import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FeedbackWidgetService } from 'src/app/services/feedback-widget.service';
import { BreadcrumbsService } from '../../display-elements/breadcrumbs.service';
import { App } from 'src/app/models/app.model';
import { WidgetFeedback, AverageRating } from 'src/app/models/feedback-widget.model';
import { Subscription, forkJoin, Observable } from 'rxjs';
import { AppsService } from 'src/app/services/apps.service';
import { MatTableModule, MatTable } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { SSPList } from '../../../base-classes/ssp-list';
import { WidgetFeedbackWithModels } from 'src/app/models/widget-feedback-with-models.model';
import { ApiSearchCriteria } from 'src/app/models/api-search-criteria.model';
import { Widget } from 'src/app/models/widget.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-widget-averages',
  templateUrl: './list-widget-averages.component.html',
  styleUrls: ['./list-widget-averages.component.scss']
})
export class ListWidgetAveragesComponent implements OnInit, OnDestroy {

  cacheSub: Subscription;
  items: Array<WidgetFeedbackWithModels>;
  sortSub: Subscription;
  readonly columnsToDisplay = ['rating', 'widget', 'app', 'submissions', 'view'];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<WidgetFeedbackWithModels>;

  constructor(
    private appSvc: AppsService,
    private widgetFeedbackSvc: FeedbackWidgetService, 
    private crumbsSvc: BreadcrumbsService,
    private router: Router) {
      this.items = new Array<WidgetFeedbackWithModels>();
  }

  ngOnInit() {
    this.subscribeToSort();
    this.subscribeToAppCache();
  }

  ngOnDestroy() {
    this.cacheSub.unsubscribe();
    this.sortSub.unsubscribe();
  }

  private subscribeToSort(): void{
    this.sortSub = this.sort.sortChange.subscribe((s: Sort) => {
      let field: string;
      let subfield: string;
      let direction: number = (s.direction === 'desc' ? -1 : 1);

      switch(s.active){
        case 'rating':
          field = 'averageRating';
          subfield = 'rating';
          break;
        case 'widget':
          field = 'widget';
          subfield = 'widgetTitle';
          break;
        case 'app':
          field = 'app';
          subfield = 'appTitle';
          break;
        case 'submissions':
          field = 'averageRating';
          subfield = 'totalRatings';
          break;
      }

      if(s.active === 'rating'){
        this.items.sort((a: WidgetFeedbackWithModels, b: WidgetFeedbackWithModels) => {
          return (a.averageRating.rating < b.averageRating.rating ? -1 : (a.averageRating.rating > b.averageRating.rating ? 1 : 0)) * direction;
        });
      }
      else{
        this.items.sort((a: WidgetFeedbackWithModels, b: WidgetFeedbackWithModels) => {
          return (a[field][subfield] < b[field][subfield] ? -1 : (a[field][subfield] > b[field][subfield] ? 1 : 0)) * direction;
        });
      }

      this.table.renderRows();
    });
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

    let temp = new Array<WidgetFeedbackWithModels>();
    for(let appsIndex = 0; appsIndex < apps.length; appsIndex++){
      if(apps[appsIndex].widgets){
        let modelsIndex = this.items.findIndex((wfwm: WidgetFeedbackWithModels) => wfwm.app.docId === apps[appsIndex].docId);
        if(modelsIndex !== -1){
          temp.push(this.items[modelsIndex]);
          this.items.splice(modelsIndex, 1);
        }
        else{
          let avg: AverageRating;
          for(let i = 0; i < apps[appsIndex].widgets.length; i++){
            let avg: AverageRating;
            try{
              avg = await this.widgetFeedbackSvc.fetchWidgetAverage(apps[appsIndex].widgets[i].docId).toPromise();
              temp.push({app: apps[appsIndex], widget: apps[appsIndex].widgets[i], averageRating: avg});
            }
            catch(e){
              console.error(e);
            }
          }
        }
      }
    }
    this.items = temp;
  }

  private navigateToApp(app: App){
    if(app.native){
      this.router.navigateByUrl(`/portal/${app.docId}`);
    }
    else{
      this.router.navigateByUrl(`/portal/app/${app.docId}`);
    }
  }
}
