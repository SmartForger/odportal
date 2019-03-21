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
    this.generateMockHttpRequests();
  }

  ngOnDestroy() {
    this.requestCompletionSub.unsubscribe();
    clearInterval(this.mockRequestInterval);
  }

  showRequestDetails(request: ApiRequest): void {
    this.activeRequest = request;
    this.showDetailsModal = true;
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

  generateMockHttpRequests(): void {
    this.mockRequestInterval = setInterval(() => {
      this.httpSuccesses = new Array<ApiRequest>();
      this.httpFailures = new Array<ApiRequest>();
      let reqs: Array<ApiRequest> = new Array<ApiRequest>(
        {
          uri: 'https://docker.emf360.com:49100/auth/admin/realms/my-realm/users',
          verb: 'GET',
          onSuccess: (response: any) => {
            console.log("onSuccess");
            console.log(response);
          },
          onError: (err: any) => {
            console.log("onError");
            console.log(err);
          },
          appId: this.app.docId,
          widgetId: this.app.widgets[0].docId
        },
        {
          uri: 'https://docker.emf360.com:49100/auth/admin/realms/my-realm/users/123',
          verb: 'GET',
          onSuccess: (response: any) => {
            console.log("onSuccess");
            console.log(response);
          },
          onError: (err: any) => {
            console.log("onError");
            console.log(err);
          },
          appId: this.app.docId
        },
        {
          uri: 'https://docker.emf360.com:49100/auth/admin/realms/my-realm/users',
          verb: 'POST',
          body: {},
          onSuccess: (response: any) => {
            console.log("onSuccess");
            console.log(response);
          },
          onError: (err: any) => {
            console.log("onError");
            console.log(err);
          },
          appId: this.app.docId
        }
      );
      reqs.forEach((req: ApiRequest) => {
        this.httpControllerSvc.send(req, this.app);
      });
    }, 10000);
  }

  private getWidgetTitle(widgetId: string): string {
    return this.app.widgets.find((w: Widget) => w.docId === widgetId).widgetTitle;
  }

}
