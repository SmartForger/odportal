import { Component, Input, Output, EventEmitter } from "@angular/core";
import { FormGroup, FormBuilder, FormControl, Validators } from "@angular/forms";
import { KeyValue } from "../../../models/key-value.model";
import { SharedRequest } from "src/app/models/shared-request.model";
import { AppsService } from "src/app/services/apps.service";
import { App } from "src/app/models/app.model";
import { MatDialog } from "@angular/material";
import { AppPickerModalComponent } from "../app-picker-modal/app-picker-modal.component";
import { ConfirmModalComponent } from "../../display-elements/confirm-modal/confirm-modal.component";
import { SharedRequestsService } from "src/app/services/shared-requests.service";

@Component({
  selector: "app-custom-attribute-card",
  templateUrl: "./custom-attribute-card.component.html",
  styleUrls: ["./custom-attribute-card.component.scss"]
})
export class CustomAttributeCardComponent {
  @Input('sharedRequest')
  get sharedRequest(): SharedRequest{
    return this._sharedRequest;
  }
  set sharedRequest(sharedRequest: SharedRequest){
    this._sharedRequest = sharedRequest;
    this.updateForm();
  }
  private _sharedRequest: SharedRequest;

  @Output() update: EventEmitter<void>;

  apps: Array<App>;
  form: FormGroup;
  enablePolling: boolean;
  
  readonly METHOD_OPTIONS: Array<KeyValue> = [
    {display: 'GET', value: 'GET'}
  ]

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
      polling: 0
    };
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      endpoint: new FormControl('', Validators.required),
      method: new FormControl('', Validators.required),
      polling: new FormControl('')
    });
    this.enablePolling = false;
    this.appSvc.listApps().subscribe((apps: Array<App>) => {
      this.apps = apps;
    });
    this.update = new EventEmitter<void>();
  }

  confirmDelete() {
    let dialogRef = this.dialog.open(ConfirmModalComponent);
    dialogRef.componentInstance.title = 'Confirm Deletion';
    dialogRef.componentInstance.message = 'Are you sure you want to delete this shared request?';
    dialogRef.componentInstance.icons =  [{icon: 'delete_forever', classList: ''}];
    dialogRef.componentInstance.buttons = [{title: 'Delete', classList: 'bg-red'}];
    dialogRef.componentInstance.btnClick.subscribe((btn: string) => {
      if(btn === 'Delete'){
        this.delete();
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
    this.sharedRequest.headers.push({display: '', value: ''});
    this.form.addControl(`headerKey${this.sharedRequest.headers.length - 1}`, new FormControl(''));
    this.form.addControl(`headerValue${this.sharedRequest.headers.length - 1}`, new FormControl(''));
  }

  addApp(){
    let dialogRef = this.dialog.open(AppPickerModalComponent);
    dialogRef.componentInstance.apps = this.apps;
    dialogRef.componentInstance.selectApp.subscribe((id: string) => {
      if(id){
        this.sharedRequest.appIds.push(id);
        this.form.addControl(`appId${this.sharedRequest.appIds.length - 1}`, new FormControl(this.getAppName(id)));
      }
      dialogRef.close();
    });
  }

  removeApp(index: number){
    this.form.removeControl(`appId${index}`);
    this.sharedRequest.appIds.splice(index, 1);
  }

  getAppName(id: string){
    return this.apps.find((app: App) => app.docId === id).appTitle;
  }

  save(): void{
    console.log(this.form.valid);
    let updatedReq: SharedRequest = {
      docId:  this.sharedRequest.docId,
      type: 'sharedRequest',
      name: this.form.controls['name'].value,
      method: this.form.controls['method'].value,
      endpoint: this.form.controls['endpoint'].value,
      polling: 0,
      headers: [ ],
      appIds: this.sharedRequest.appIds
    };
    let i = 0;
    while(this.form.contains(`headerKey${i}`)){
      updatedReq.headers.push({display: this.form.controls[`headerKey${i}`].value, value: this.form.controls[`headerValue${i}`].value});
      i++;
    }

    this.sharedReqSvc.updateSharedRequest(updatedReq).subscribe((result: SharedRequest) => {
      this.update.emit();
    });
  }

  private updateForm(): void{
    this.form = new FormGroup({
      name: new FormControl(this.sharedRequest.name, [Validators.required, Validators.pattern('^\S*$')]),
      endpoint: new FormControl(this.sharedRequest.endpoint, Validators.required),
      method: new FormControl(this.sharedRequest.method, Validators.required)
    });

    this.enablePolling = this.sharedRequest.polling > 0;
    this.form.addControl('polling', new FormControl((this.enablePolling ? this.sharedRequest.polling : 0)));

    if(this.sharedRequest.headers){
      for(let i = 0; i < this.sharedRequest.headers.length; i++){
        this.form.addControl(`headerKey${i}`, new FormControl(this.sharedRequest.headers[i].display));
        this.form.addControl(`headerValue${i}`, new FormControl(this.sharedRequest.headers[i].value));
      }
    }

    for(let i = 0; i < this.sharedRequest.appIds.length; i++){
      this.form.addControl(`appId${i}`, new FormControl(this.sharedRequest.appIds[i]));
    }
  }

  private delete(): void{
    this.sharedReqSvc.deleteSharedRequest(this._sharedRequest.docId).subscribe(() => {
      this.update.emit(null);
    });
  }
}
