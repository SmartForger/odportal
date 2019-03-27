import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserDashboard } from 'src/app/models/user-dashboard.model';
import { DashboardDetailsModalComponent } from '../dashboard-details-modal/dashboard-details-modal.component';
import { AuthService } from 'src/app/services/auth.service';
import { DashboardService } from 'src/app/services/dashboard.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ConfirmModalComponent } from '../../display-elements/confirm-modal/confirm-modal.component';
import { WidgetModalComponent } from '../../portal/widget-modal/widget-modal.component';

@Component({
  selector: 'app-dashboard-options',
  templateUrl: './dashboard-options.component.html',
  styleUrls: ['./dashboard-options.component.scss']
})
export class DashboardOptionsComponent implements OnInit {

  @Input() userDashboards: Array<UserDashboard>;
  @Input() dashIndex: number;

  private _editMode: boolean;
  @Input('editMode') 
  get editMode(): boolean{return this._editMode;}
  set editMode(editMode: boolean){this._editMode = editMode;}

  @Output() setDashboard: EventEmitter<number>;
  @Output() enterEditMode: EventEmitter<any>;
  @Output() leaveEditMode: EventEmitter<boolean>;

  constructor(private authSvc: AuthService, private dashSvc: DashboardService, private dialog: MatDialog) { 
    this.setDashboard = new EventEmitter();
    this.enterEditMode = new EventEmitter();
    this.leaveEditMode = new EventEmitter();
  }

  ngOnInit() {
  }

  setDashboardDetails(){
    let modalRef: MatDialogRef<DashboardDetailsModalComponent> = this.dialog.open(DashboardDetailsModalComponent, {
      
    });

    modalRef.componentInstance.dashTitle = this.userDashboards[this.dashIndex].title;
    modalRef.componentInstance.dashDescription = (this.userDashboards[this.dashIndex].description ? this.userDashboards[this.dashIndex].description : '');

    modalRef.componentInstance.details.subscribe(details => {
      this.userDashboards[this.dashIndex].title = details.title;
      this.userDashboards[this.dashIndex].description = details.description;
      modalRef.close();
    });
  }

  createNewDashboard(){
    this.dashSvc.addDashboard(UserDashboard.createDefaultDashboard(this.authSvc.getUserId())).subscribe(
      (dashboard) => {
        this.userDashboards.push(dashboard);
        this.setDashboard.emit(this.userDashboards.length - 1);
        this.enterEditMode.emit();
        this.setDashboardDetails();
      }
    );
  }

  deleteDashboard(){
    let modalRef: MatDialogRef<ConfirmModalComponent> = this.dialog.open(ConfirmModalComponent, {
      
    });

    modalRef.componentInstance.title = 'Delete Dashboard';
    modalRef.componentInstance.message = 'Are you sure you want to delete ' + this.userDashboards[this.dashIndex].title + ' from your dashboards?';
    modalRef.componentInstance.icons =  [{icon: 'delete', classList: ''}];
    modalRef.componentInstance.buttons = [{title: 'Confirm', classList: 'btn btn-danger'}];

    modalRef.componentInstance.btnClick.subscribe(btnClick => {
      if(btnClick === 'Confirm'){
        this.leaveEditMode.emit(true);
  
        if(this.userDashboards[this.dashIndex].docId){
          this.dashSvc.deleteDashboard(this.userDashboards[this.dashIndex].docId).subscribe(
            (dashboard) => {this.deleteLocalDashboard();}
          );
        }
        else{
          this.deleteLocalDashboard();
        }
      }
      modalRef.close();
    });
  }

  setDefault(): void{
    if(this.userDashboards[this.dashIndex].docId){
      this.dashSvc.setDefaultDashboard(this.userDashboards[this.dashIndex].docId).subscribe();
    }
  }

  addWidget(): void{
    let modalRef: MatDialogRef<WidgetModalComponent> = this.dialog.open(WidgetModalComponent, {

    });

    modalRef.componentInstance.close.subscribe(close => modalRef.close());
  }

  private deleteLocalDashboard(){
    this.userDashboards.splice(this.dashIndex, 1);
    if(this.dashIndex >= this.userDashboards.length){
      this.setDashboard.emit(this.userDashboards.length - 1);
    }
    else{
      this.setDashboard.emit(this.dashIndex);
    }
  }

}
