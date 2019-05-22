import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WidgetFeedback, AverageRating } from '../models/feedback-widget.model';
import { AuthService } from './auth.service';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class FeedbackWidgetService {

  constructor(private authSvc: AuthService, private http: HttpClient) { }

  fetch(): Observable<Array<WidgetFeedback>>{
    return this.http.get<Array<WidgetFeedback>>(
      `${this.baseUrl()}`,
      {
        headers: this.authSvc.getAuthorizationHeader()
      }
    );
  }

  create(feedback: WidgetFeedback, screenshot: File = null): Observable<WidgetFeedback>{
    let formData = new FormData();
    formData.append('feedback', JSON.stringify(feedback));
    if (screenshot) {
      formData.append('screenshot', screenshot);
    }
    return this.http.post<WidgetFeedback>(
      `${this.baseUrl()}`,
      formData,
      {
        headers: this.authSvc.getAuthorizationHeader()
      }
    );
  } 

  delete(docId: string): Observable<boolean>{
    return new Observable((observer) => {
      this.http.delete<ApiResponse>(
        `${this.baseUrl()}/${docId}`,
        {
          headers: this.authSvc.getAuthorizationHeader()
        }
      ).subscribe((response: ApiResponse) => {
        console.log(`DELETE RESPONSE.`);
        console.log(response);
        if(response.code === 200 || response.message === 'Success'){
          observer.next(true);
          observer.complete();
        }
        else{
          observer.next(false);
          observer.complete();
        }
      });
    });
  }

  fetchWidgetFeedback(widgetId: string): Observable<Array<WidgetFeedback>>{
    return this.http.get<Array<WidgetFeedback>>(
      `${this.baseUrl()}/widget/${widgetId}`,
      {
        headers: this.authSvc.getAuthorizationHeader()
      }
    )
  }

  deleteWidgetFeedback(widgetId: string): Observable<boolean>{
    return new Observable((observer) => {
      this.http.delete<ApiResponse>(
        `${this.baseUrl()}/widget/${widgetId}`,
        {
          headers: this.authSvc.getAuthorizationHeader()
        }
      ).subscribe((response: ApiResponse) => {
        if(response.code === 200  || response.message === 'Success'){
          observer.next(true);
          observer.complete();
        }
        else{
          observer.next(false);
          observer.complete();
        }
      });
    });
  }

  fetchWidgetAverage(widgetId: string): Observable<AverageRating>{
    return this.http.get<AverageRating>(
      `${this.baseUrl()}/widget/${widgetId}/avg`,
      {
        headers: this.authSvc.getAuthorizationHeader()
      }
    )
  }

  fetchWidgetFeedbackByApp(appId: string): Observable<Array<Array<WidgetFeedback>>>{
    return this.http.get<Array<Array<WidgetFeedback>>>(
      `${this.baseUrl()}/app/${appId}`,
      {
        headers: this.authSvc.getAuthorizationHeader()
      }
    );
  }

  deleteWidgetFedbackByApp(appId: string): Observable<boolean>{
    return new Observable((observer) => {
      this.http.delete<ApiResponse>(
        `${this.baseUrl()}/app/${appId}`,
        {
          headers: this.authSvc.getAuthorizationHeader()
        }
      ).subscribe((response: ApiResponse) => {
        if(response.code === 200){
          observer.next(true);
          observer.complete();
        }
        else{
          observer.next(false);
          observer.complete();
        }
      });
    });
  }

  fetchWidgetAverageByApp(appId: string): Observable<Array<AverageRating>>{
    return this.http.get<Array<AverageRating>>(
      `${this.baseUrl()}/app/${appId}/avg`,
      {
        headers: this.authSvc.getAuthorizationHeader()
      }
    )
  }

  fetchAppAverage(appId: string): Observable<AverageRating>{
    return new Observable();
  }

  private baseUrl(): string {
    return `${this.authSvc.globalConfig.feedbackServiceConnection}api/v1/feedback/realm/${this.authSvc.globalConfig.realm}/widget-feedback`;
  }
}
