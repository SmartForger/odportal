/**
 * @description Manages options for the user dashboard: set title, set description, choose active dashboard, edit/delete options, etc.
 * @author James Marcu
 */

import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';

import { AuthService } from 'src/app/services/auth.service';
import { DashboardService } from 'src/app/services/dashboard.service';
import { DashboardDetailsModalComponent } from '../dashboard-details-modal/dashboard-details-modal.component';
import { ConfirmModalComponent } from '../../display-elements/confirm-modal/confirm-modal.component';
import { UserDashboard } from 'src/app/models/user-dashboard.model';
import { WidgetModalService } from 'src/app/services/widget-modal.service';

@Component({
  selector: 'app-dashboard-options',
  templateUrl: './dashboard-options.component.html',
  styleUrls: ['./dashboard-options.component.scss']
})
export class DashboardOptionsComponent implements OnInit{
  @Input() userDashboards: Array<UserDashboard>;
  @Input() dashIndex: number;
  @Input() editMode: boolean;

  @Output() setDashboard:  EventEmitter<number>;
  @Output() enterEditMode: EventEmitter<void>;
  @Output() leaveEditMode: EventEmitter<boolean>;

  constructor(
    private authSvc: AuthService, 
    private dashSvc: DashboardService, 
    private dialog: MatDialog,
    private widgetModalSvc: WidgetModalService) 
  { 
    this.userDashboards = new Array<UserDashboard>();
    this.dashIndex = 0;
    this.editMode = false;

    this.setDashboard  = new EventEmitter<number>();
    this.enterEditMode = new EventEmitter<void>();
    this.leaveEditMode = new EventEmitter<boolean>();
  }

  ngOnInit(){}

  setDashboardDetails(){
    let modalRef: MatDialogRef<DashboardDetailsModalComponent> = this.dialog.open(DashboardDetailsModalComponent, {
      
    });

    modalRef.componentInstance.dashTitle = (this.userDashboards[this.dashIndex].title ? this.userDashboards[this.dashIndex].title : '');
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
        this.dashIndex = this.userDashboards.length - 1;
        this.setDashboard.emit(this.dashIndex);
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
    modalRef.componentInstance.icons =  [{icon: 'dashboard', classList: ''}];
    modalRef.componentInstance.buttons = [{title: 'Delete', classList: 'bg-red'}];

    modalRef.componentInstance.btnClick.subscribe(btnClick => {
      if(btnClick === 'Delete'){
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
    this.widgetModalSvc.show();
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
