import { Injectable } from '@angular/core';
import {Breadcrumb} from './breadcrumb.model';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbsService {

  breadcrumbUpdatedSub: BehaviorSubject<Array<Breadcrumb>>;

  constructor() { 
    this.breadcrumbUpdatedSub = new BehaviorSubject<Array<Breadcrumb>>(null);
  }

  update(crumbs: Array<Breadcrumb>): void {
    setTimeout(() => {
      this.breadcrumbUpdatedSub.next(crumbs);
    });
  }
}
