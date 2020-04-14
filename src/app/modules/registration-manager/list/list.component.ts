import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RegistrationManagerService } from 'src/app/services/registration-manager.service';
import { UserProfileKeycloak } from 'src/app/models/user-profile.model';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent{
  service: RegistrationManagerService;

  constructor(
    private router: Router,
    private regManagerSvc: RegistrationManagerService
  ) { 
    this.service = this.regManagerSvc;
  }

  userSelected(regId: string){
    this.router.navigateByUrl(`/portal/registration/users/${regId}`)
  }

  editWorkflow(row: any) {
    this.router.navigateByUrl(`/portal/registration/workflows/${row.id}`)
  }

  onUserClick(user: UserProfileKeycloak): void{
      
  }
}
