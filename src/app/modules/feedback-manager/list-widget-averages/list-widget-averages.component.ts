import { Component, OnInit } from '@angular/core';
import { DirectQueryList } from 'src/app/base-classes/direct-query-list';
import { Filters } from 'src/app/util/filters';
import { ApiSearchCriteria } from 'src/app/models/api-search-criteria.model';
import { FeedbackWidgetService } from 'src/app/services/feedback-widget.service';
import { WidgetGroupAvgRating } from 'src/app/models/feedback-widget.model';

@Component({
  selector: 'app-list-widget-averages',
  templateUrl: './list-widget-averages.component.html',
  styleUrls: ['./list-widget-averages.component.scss'],
})
export class ListWidgetAveragesComponent extends DirectQueryList<WidgetGroupAvgRating> implements OnInit {
  searchCriteria: ApiSearchCriteria;
  search: string;

  constructor(private widgetFeedbackSvc: FeedbackWidgetService) {
    super(new Array<string>('rating', 'widgetTitle', 'totalRatings', 'actions'));

    this.search = '';
    this.searchCriteria = new ApiSearchCriteria({ widgetTitle: '' }, 0, 'rating', 'desc');
    this.query = function(first: number, max: number) {
      return this.widgetFeedbackSvc.listGroupAverages(this.searchCriteria);
    }.bind(this);
  }

  ngOnInit() {
    this.fetchAll();
  }

  protected filterItems(): void {
    if (this.sortColumn === '') {
      this.sortColumn = 'rating';
    }
    this.filteredItems.sort((a: WidgetGroupAvgRating, b: WidgetGroupAvgRating) => {
      const sortOrder = this.sort.direction === 'desc' ? -1 : 1;

      return a[this.sortColumn] < b[this.sortColumn] ? -1 * sortOrder : sortOrder;
    });
  }

  filterFeedbacks(keyword: string): void {
    this.search = keyword;
    const filterKeys = ['widgetTitle'];
    this.filteredItems = Filters.filterByKeyword(filterKeys, keyword, this.items);
    this.page = 0;
    this.listDisplayItems();
  }
}
