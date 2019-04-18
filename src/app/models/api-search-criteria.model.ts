import {HttpParams} from '@angular/common/http';

export class ApiSearchCriteria {

    filters: any;
    pageIndex: number;
    sortColumn: string;
    sortOrder: string;

    constructor(filters: any, pageIndex: number, sortColumn: string, sortOrder: string) {
        this.filters = filters;
        this.pageIndex = pageIndex;
        this.sortColumn = sortColumn;
        this.sortOrder = sortOrder;
    }

    asHttpParams(): HttpParams {
        let params: HttpParams = new HttpParams();
        for (let key in this.filters) {
            params = params.set(key, this.filters[key]);
        }
        params = params.set('pageIndex', this.pageIndex.toString());
        params = params.set('sortColumn', this.sortColumn);
        params = params.set('sortOrder', this.sortOrder);
        return params;
    }

}