import { Component, OnInit } from '@angular/core';
import { Filters } from 'src/app/util/filters';
import { ApiSearchCriteria } from 'src/app/models/api-search-criteria.model';
import { FeedbackService } from 'src/app/services/feedback.service';
import { FeedbackPageGroupAvg } from 'src/app/models/feedback.model';
import { BreadcrumbsService } from '../../display-elements/breadcrumbs.service';
import { Breadcrumb } from '../../display-elements/breadcrumb.model';
import { DirectQueryList } from 'src/app/base-classes/direct-query-list';

@Component({
  selector: 'app-list-page-averages',
  templateUrl: './list-page-averages.component.html',
  styleUrls: ['./list-page-averages.component.scss'],
})
export class ListPageAveragesComponent extends DirectQueryList<FeedbackPageGroupAvg> implements OnInit {
  searchCriteria: ApiSearchCriteria;
  search: string;

  constructor(private feedbackSvc: FeedbackService, private crumbsSvc: BreadcrumbsService) {
    super(new Array<string>('rating', 'pageGroup', 'totalRatings', 'actions'));

    this.search = '';
    this.searchCriteria = new ApiSearchCriteria({ pageGroup: '' }, 0, 'rating', 'desc');
    this.query = function(first: number, max: number) {
      return this.feedbackSvc.listGroupAverages(this.searchCriteria);
    }.bind(this);
  }

  ngOnInit() {
    this.fetchAll();
    this.generateCrumbs();
  }

  private generateCrumbs(): void {
    const crumbs: Array<Breadcrumb> = new Array<Breadcrumb>(
      {
        title: 'Dashboard',
        active: false,
        link: '/portal',
      },
      {
        title: 'Feedback Manager',
        active: true,
        link: null,
      }
    );
    this.crumbsSvc.update(crumbs);
  }

  protected filterItems(): void {
    if (this.sortColumn === '') {
      this.sortColumn = 'rating';
    }
    this.filteredItems.sort((a: FeedbackPageGroupAvg, b: FeedbackPageGroupAvg) => {
      const sortOrder = this.sort.direction === 'desc' ? -1 : 1;

      return a[this.sortColumn] < b[this.sortColumn] ? -1 * sortOrder : sortOrder;
    });
  }

  filterFeedbacks(keyword: string): void {
    this.search = keyword;
    const filterKeys = ['pageGroup'];
    this.filteredItems = Filters.filterByKeyword(filterKeys, keyword, this.items);
    this.page = 0;
    this.listDisplayItems();
  }
}
