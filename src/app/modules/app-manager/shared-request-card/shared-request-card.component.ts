import { Component, Input, Output, EventEmitter } from "@angular/core";
import { SharedRequest } from "src/app/models/shared-request.model";
import { AppsService } from "src/app/services/apps.service";
import { App } from "src/app/models/app.model";
import { MatDialog } from "@angular/material";
import { AppPickerModalComponent } from "../app-picker-modal/app-picker-modal.component";
import { ConfirmModalComponent } from "../../display-elements/confirm-modal/confirm-modal.component";
import { SharedRequestsService } from "src/app/services/shared-requests.service";

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
      polling: 0
    };
    this.delete = new EventEmitter<void>();
    this.save = new EventEmitter<void>();
  }

  confirmDelete() {
    let dialogRef = this.dialog.open(ConfirmModalComponent);
    dialogRef.componentInstance.title = 'Confirm Deletion';
    dialogRef.componentInstance.message = 'Are you sure you want to delete this shared request?';
    dialogRef.componentInstance.icons =  [{icon: 'delete_forever', classList: ''}];
    dialogRef.componentInstance.buttons = [{title: 'Delete', classList: 'bg-red'}];
    dialogRef.componentInstance.btnClick.subscribe((btn: string) => {
      if(btn === 'Delete'){
        this.delete.emit(null);
      }
      dialogRef.close();
    })
  }

  title?: string;
  message?: string;
  icons?: {
    icon: string;
    class?: string;
  }
  buttons?: {
    action: string;
    title: string;
    color: string;
    class?: string;
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
    if(this.sharedRequest.name && this.sharedRequest.method && this.sharedRequest.endpoint){
      this.save.emit(null);
    }
  }
}
