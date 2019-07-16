import { Component } from "@angular/core";
import { AppsService } from "../../../services/apps.service";
import { App } from "../../../models/app.model";
import { SharedRequest } from "src/app/models/shared-request.model";
import { SharedRequestsService } from "src/app/services/shared-requests.service";

@Component({
  selector: "app-custom-attributes-tab",
  templateUrl: "./custom-attributes-tab.component.html",
  styleUrls: ["./custom-attributes-tab.component.scss"]
})
export class CustomAttributesTabComponent {
  
  sharedRequests: Array<SharedRequest>;
  apps: Array<App>;

  constructor(private sharedReqSvc: SharedRequestsService, private appSvc: AppsService) {
    console.log(this.sharedReqSvc.getSharedRequests());
    this.sharedRequests = this.sharedReqSvc.getSharedRequests();
    this.appSvc.listApps().subscribe((apps: Array<App>) => {
      console.log('got the apps');
      console.log(apps);
      this.apps = apps;
    });
  }

  add() {
    let newReq: SharedRequest = {
      name: 'New Request',
      method: 'GET',
      endpoint: 'http://',
      headers: [ ],
      appIds: [ ],
      enablePolling: false,
      polling: 0
    };
    this.sharedReqSvc.createSharedRequest(newReq).subscribe((result: SharedRequest) => {
      this.sharedRequests = this.sharedReqSvc.getSharedRequests();
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
