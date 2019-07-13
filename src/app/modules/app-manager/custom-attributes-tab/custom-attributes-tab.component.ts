import {
  Component,
  OnInit,
  ViewChildren,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  Input
} from "@angular/core";
import { CustomAttributeCardComponent } from "../custom-attribute-card/custom-attribute-card.component";
import { AppsService } from "../../../services/apps.service";
import { App } from "../../../models/app.model";
import { KeyValue } from "../../../models/key-value.model";
import { SharedRequest } from "src/app/models/shared-request.model";
import { SharedRequestsService } from "src/app/services/shared-requests.service";

@Component({
  selector: "app-custom-attributes-tab",
  templateUrl: "./custom-attributes-tab.component.html",
  styleUrls: ["./custom-attributes-tab.component.scss"]
})
export class CustomAttributesTabComponent implements OnInit {
  
  sharedRequests: Array<SharedRequest>;

  constructor(private sharedReqSvc: SharedRequestsService) {
    console.log(this.sharedReqSvc.getSharedRequests());
    this.sharedRequests = this.sharedReqSvc.getSharedRequests();
  }

  ngOnInit() {
  }

  add() {
    let newReq: SharedRequest = {
      name: 'New Request',
      method: 'GET',
      endpoint: 'http://',
      polling: 0,
      appIds: [ ]
    };
    this.sharedReqSvc.createSharedRequest(newReq).subscribe((result: SharedRequest) => {
      this.sharedRequests = this.sharedReqSvc.getSharedRequests();
    });
  }

  updateRequests(): void{
    this.sharedRequests = this.sharedReqSvc.getSharedRequests();
  }
}
