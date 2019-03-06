import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { UserDashboard } from 'src/app/models/user-dashboard.model';
import { DashboardDetailsModalComponent } from '../dashboard-details-modal/dashboard-details-modal.component';
import { ModalComponent } from '../../display-elements/modal/modal.component';
import { AuthService } from 'src/app/services/auth.service';
import { DashboardService } from 'src/app/services/dashboard.service';

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

  @ViewChild('dashboardDetailsModal') private dashboardDetailsModal: DashboardDetailsModalComponent;
  @ViewChild('confirmDashboardDeletionModal') private dashboardDeletionModal: ModalComponent;

  constructor(private authSvc: AuthService, private dashSvc: DashboardService) { 
    this.setDashboard = new EventEmitter();
    this.enterEditMode = new EventEmitter();
    this.leaveEditMode = new EventEmitter();
  }

  ngOnInit() {
  }

  setDashboardDetails(input: any){
    this.userDashboards[this.dashIndex].title = input.title;
    this.userDashboards[this.dashIndex].description = input.description;
  }

  createNewDashboard(){
    this.dashSvc.addDashboard(UserDashboard.createDefaultDashboard(this.authSvc.getUserId())).subscribe(
      (dashboard) => {
        this.userDashboards.push(dashboard);
        this.setDashboard.emit(this.userDashboards.length - 1);
        this.enterEditMode.emit();
        this.dashboardDetailsModal.show = true;
      }
    );
  }

  deleteDashboard(buttonTitle: string){
    this.dashboardDeletionModal.show = false;
    if(buttonTitle === 'confirm'){
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
