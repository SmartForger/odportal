import { Injectable } from '@angular/core';
import { Router, NavigationEnd, NavigationStart, ActivatedRouteSnapshot } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import { Feedback, FeedbackPageGroupAvg } from '../models/feedback.model';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { AuthService } from './auth.service';
import { ApiResponse } from '../models/api-response.model';
import { ApiSearchCriteria } from '../models/api-search-criteria.model';

@Injectable({
  providedIn: 'root',
})
export class FeedbackService {
  private routeChangedSub: Subject<void>;

  private _routerParams: Set<string>;
  get routerParams(): Set<string> {
    return this._routerParams;
  }

  constructor(private router: Router, private http: HttpClient, private authSvc: AuthService) {
    this.routeChangedSub = new Subject<void>();
    this.subscribeToRouteChange();
  }

  observeRouteChanged(): Observable<void> {
    return this.routeChangedSub.asObservable();
  }

  listGroupAverages(search: ApiSearchCriteria): Observable<Array<FeedbackPageGroupAvg>> {
    return this.http.get<Array<FeedbackPageGroupAvg>>(this.createBaseAPIUrl(), {
      headers: this.authSvc.getAuthorizationHeader(),
      params: search.asHttpParams(),
    });
  }

  fetchGroupAverage(pageGroup: string): Observable<FeedbackPageGroupAvg> {
    return this.http.post<FeedbackPageGroupAvg>(
      `${this.createBaseAPIUrl()}/pageGroup/avg`,
      {
        pageGroup: pageGroup,
      },
      {
        headers: this.authSvc.getAuthorizationHeader(),
      }
    );
  }

  listPageFeedback(pageGroup: string): Observable<Array<Feedback>> {
    return this.http.post<Array<Feedback>>(
      `${this.createBaseAPIUrl()}/pageGroup/list`,
      {
        pageGroup: pageGroup,
      },
      {
        headers: this.authSvc.getAuthorizationHeader(),
      }
    );
  }

  create(feedback: Feedback, screenshot: File = null): Observable<HttpEvent<Feedback>> {
    let formData = new FormData();
    formData.append('feedback', JSON.stringify(feedback));
    if (screenshot) {
      formData.append('screenshot', screenshot);
    }
    let req: HttpRequest<FormData> = new HttpRequest<FormData>('POST', this.createBaseAPIUrl(), formData, {
      headers: this.authSvc.getAuthorizationHeader(true),
    });
    return this.http.request<Feedback>(req);
  }

  delete(docId: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.createBaseAPIUrl()}/${docId}`, {
      headers: this.authSvc.getAuthorizationHeader(),
    });
  }

  deleteByPageGroup(pageGroup: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.createBaseAPIUrl()}/pageGroup/delete`,
      {
        pageGroup: pageGroup,
      },
      {
        headers: this.authSvc.getAuthorizationHeader(),
      }
    );
  }

  private subscribeToRouteChange(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this._routerParams = new Set<string>();
        this.collectParams(this.router.routerState.snapshot.root);
      } else if (event instanceof NavigationStart) {
        this.routeChangedSub.next();
      }
    });
  }

  private collectParams(root: ActivatedRouteSnapshot): void {
    root.children.forEach((snapshot: ActivatedRouteSnapshot) => {
      snapshot.paramMap.keys.forEach((key: string) => {
        this._routerParams.add(snapshot.paramMap.get(key));
      });
      this.collectParams(snapshot);
    });
  }

  private createBaseAPIUrl(): string {
    return `${this.authSvc.globalConfig.feedbackServiceConnection}api/v1/pages/realm/${this.authSvc.globalConfig.realm}`;
  }
}
