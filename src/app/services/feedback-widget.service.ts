import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WidgetFeedback, WidgetGroupAvgRating } from '../models/feedback-widget.model';
import { AuthService } from './auth.service';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { ApiResponse } from '../models/api-response.model';
import { ApiSearchCriteria } from '../models/api-search-criteria.model';

@Injectable({
  providedIn: 'root',
})
export class FeedbackWidgetService {
  constructor(private authSvc: AuthService, private http: HttpClient) {}

  listGroupAverages(search: ApiSearchCriteria): Observable<Array<WidgetGroupAvgRating>> {
    return this.http.get<Array<WidgetGroupAvgRating>>(this.baseUrl(), {
      headers: this.authSvc.getAuthorizationHeader(),
      params: search.asHttpParams(),
    });
  }

  fetchGroupAverage(widgetId: string): Observable<WidgetGroupAvgRating> {
    return this.http.get<WidgetGroupAvgRating>(`${this.baseUrl()}/widgetGroup/${widgetId}/avg`, {
      headers: this.authSvc.getAuthorizationHeader(),
    });
  }

  listWidgetFeedback(widgetId: string): Observable<Array<WidgetFeedback>> {
    return this.http.get<Array<WidgetFeedback>>(`${this.baseUrl()}/widgetGroup/${widgetId}`, {
      headers: this.authSvc.getAuthorizationHeader(),
    });
  }

  create(feedback: WidgetFeedback, screenshot: File = null): Observable<HttpEvent<WidgetFeedback>> {
    let formData = new FormData();
    formData.append('feedback', JSON.stringify(feedback));
    if (screenshot) {
      formData.append('screenshot', screenshot);
    }
    let req: HttpRequest<FormData> = new HttpRequest<FormData>('POST', this.baseUrl(), formData, {
      headers: this.authSvc.getAuthorizationHeader(true),
    });
    return this.http.request<WidgetFeedback>(req);
  }

  delete(docId: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.baseUrl()}/${docId}`, {
      headers: this.authSvc.getAuthorizationHeader(),
    });
  }

  deleteByWidgetId(widgetId: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.baseUrl()}/widgetGroup/${widgetId}`, {
      headers: this.authSvc.getAuthorizationHeader(),
    });
  }

  private baseUrl(): string {
    return `${this.authSvc.globalConfig.feedbackServiceConnection}api/v1/widgets/realm/${this.authSvc.globalConfig.realm}`;
  }
}
