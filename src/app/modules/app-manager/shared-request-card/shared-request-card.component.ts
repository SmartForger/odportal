import { Component, Input, Output, EventEmitter } from "@angular/core";
import { SharedRequest } from "src/app/models/shared-request.model";
import { AppsService } from "src/app/services/apps.service";
import { App } from "src/app/models/app.model";
import { MatDialog, MatDialogRef } from "@angular/material";
import { AppPickerModalComponent } from "../app-picker-modal/app-picker-modal.component";
import { SharedRequestsService } from "src/app/services/shared-requests.service";
import { PlatformModalType } from "src/app/models/platform-modal.model";
import { PlatformModalComponent } from "../../display-elements/platform-modal/platform-modal.component";

@Component({
  selector: "app-shared-request-card",
  templateUrl: "./shared-request-card.component.html",
  styleUrls: ["./shared-request-card.component.scss"]
})
export class SharedRequestCardComponent {
  @Input() sharedRequest: SharedRequest;
  @Input() apps: Array<App>;

  @Output() delete: EventEmitter<void>;
  @Output() save: EventEmitter<void>;
  
  readonly METHOD_OPTIONS: Array<string> = ['GET']

  constructor(
    private appSvc: AppsService, 
    private dialog: MatDialog,
    private sharedReqSvc: SharedRequestsService
  ) {
    this.sharedRequest = {
      name: '',
      endpoint: '',
      method: '',
      headers: [ ],
      appIds: [ ],
      enablePolling: false,
      polling: 0,
      requestType: 'rest'
    };
    this.delete = new EventEmitter<void>();
    this.save = new EventEmitter<void>();
  }

  confirmDelete() {
    let dialogRef: MatDialogRef<PlatformModalComponent> = this.dialog.open(PlatformModalComponent, {
      data: {
        type: PlatformModalType.SECONDARY,
        title: "Confirm Deletion",
        subtitle: "Are you sure you want to delete this shared request?",
        submitButtonTitle: "Delete",
        submitButtonClass: "bg-red",
        formFields: [
          {
            type: "static",
            label: "Request name",
            defaultValue: this.sharedRequest.name
          }
        ]
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if(data){
        this.delete.emit(null);
      }
    })
  }

  addHeader() {
    if(!this.sharedRequest.headers){
      this.sharedRequest.headers = [];
    }
    this.sharedRequest.headers.push({display: '', value: ''});
  }

  removeHeader(index: number){
    this.sharedRequest.headers.splice(index, 1);
  }

  addApp(){
    let dialogRef = this.dialog.open(AppPickerModalComponent, { 
      panelClass: ['mat-dialog-no-overflow', 'mat-dialog-max-height-70vh']
    });
    dialogRef.componentInstance.apps = this.apps;
    dialogRef.componentInstance.selectApp.subscribe((id: string) => {
      if(id){
        this.sharedRequest.appIds.push(id);
      }
      dialogRef.close();
    });
  }

  removeApp(index: number){
    this.sharedRequest.appIds.splice(index, 1);
  }

  getAppName(id: string){
    for(let app of this.apps){
      if(app.docId === id){
        if(app.version){
          return `${app.appTitle} (v ${app.version})`;
        }
        else{
          return app.appTitle;
        }
      }
      else if(app.widgets){
        for(let widget of app.widgets){
          if(widget.docId === id){
            return widget.widgetTitle;
          }
        }
      }
    }
    return `ERR: Name not found for app with id ${id}.`;
  }

  validateAndSave(): void{
    if(this.sharedRequest.name && 
       (
        (this.sharedRequest.requestType === 'rest' && this.sharedRequest.endpoint && this.sharedRequest.method) ||
        (this.sharedRequest.requestType === 'wpm' && this.sharedRequest.wpmType)
       )
    ){
      this.save.emit(null);
    }
  }
}
