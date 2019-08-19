import { Component } from "@angular/core";
import { AppsService } from "../../../services/apps.service";
import { App } from "../../../models/app.model";
import { SharedRequest } from "src/app/models/shared-request.model";
import { SharedRequestsService } from "src/app/services/shared-requests.service";
import { KeyValue } from "src/app/models/key-value.model";

@Component({
  selector: "app-shared-requests-tab",
  templateUrl: "./shared-requests-tab.component.html",
  styleUrls: ["./shared-requests-tab.component.scss"]
})
export class SharedRequestsTabComponent {
  
  sharedRequests: Array<SharedRequest>;
  apps: Array<App>;

  constructor(private sharedReqSvc: SharedRequestsService, private appSvc: AppsService) {
    this.sharedReqSvc.getSharedRequests().subscribe((requests: Array<SharedRequest>) => {
      this.sharedRequests = requests;
    });
    this.appSvc.listApps().subscribe((apps: Array<App>) => {
      this.apps = apps;
    });
  }

  add() {
    let newReq: SharedRequest = {
      name: 'NewRequest',
      method: 'GET',
      endpoint: 'http://',
      headers: new Array<KeyValue>(),
      appIds: new Array<string>(),
      enablePolling: false,
      polling: 0
    };
    this.sharedReqSvc.createSharedRequest(newReq).subscribe((result: SharedRequest) => {
      this.sharedReqSvc.getSharedRequests().subscribe((requests: Array<SharedRequest>) => {
        this.sharedRequests = requests;
      });
    });
  }

  deleteRequest(index: number){
    this.sharedReqSvc.deleteSharedRequest(this.sharedRequests[index].docId).subscribe(() => {
      this.sharedRequests.splice(index, 1);
    });
  }

  saveRequest(index: number){
    this.sharedReqSvc.updateSharedRequest(this.sharedRequests[index]).subscribe((request: SharedRequest) => {
      this.sharedRequests[index] = request;
    })
  }
}
