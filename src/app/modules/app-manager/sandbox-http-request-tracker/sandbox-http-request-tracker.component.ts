import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { HttpRequestControllerService } from '../../../services/http-request-controller.service';
import { ApiRequest } from '../../../models/api-request.model';
import { App } from '../../../models/app.model';
import { Widget } from '../../../models/widget.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sandbox-http-request-tracker',
  templateUrl: './sandbox-http-request-tracker.component.html',
  styleUrls: ['./sandbox-http-request-tracker.component.scss']
})
export class SandboxHttpRequestTrackerComponent implements OnInit, OnDestroy {

  httpSuccesses: Array<ApiRequest>;
  httpFailures: Array<ApiRequest>;
  showDetailsModal: boolean;
  activeRequest: ApiRequest;
  mockRequestInterval: any;
  private requestCompletionSub: Subscription;

  @Input() app: App;

  constructor(private httpControllerSvc: HttpRequestControllerService) {
    this.httpSuccesses = new Array<ApiRequest>();
    this.httpFailures = new Array<ApiRequest>();
    this.showDetailsModal = false;
  }

  ngOnInit() {
    this.subscribeToHttpRequestCompletion();
  }

  ngOnDestroy() {
    this.requestCompletionSub.unsubscribe();
    clearInterval(this.mockRequestInterval);
  }

  showRequestDetails(request: ApiRequest): void {
    this.activeRequest = request;
    this.showDetailsModal = true;
  }

  getWidgetTitle(widgetId: string): string {
    return this.app.widgets.find((w: Widget) => w.docId === widgetId).widgetTitle;
  }

  private subscribeToHttpRequestCompletion(): void {
    this.requestCompletionSub = this.httpControllerSvc.requestCompletionSub.subscribe(
      (request: ApiRequest) => {
        if (request.appId === this.app.docId) {
          if (typeof request.response === "object") {
            request.responseAsJSON = true;
            request.response = JSON.parse(JSON.stringify(request.response));
          }
          else {
            request.responseAsJSON = false;
          }
          if (request.succeeded) {
            this.httpSuccesses.push(request);
          }
          else {
            this.httpFailures.push(request);
          }
        }
      }
    );
  }

}
