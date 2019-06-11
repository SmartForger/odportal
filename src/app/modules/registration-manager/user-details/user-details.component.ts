import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UserDetails, users, emptyUser } from '../mock-data';
import { UserRegistration } from 'src/app/models/user-registration.model';
import { UserRegistrationService } from 'src/app/services/user-registration.service';
import { UserProfile } from 'src/app/models/user-profile.model';
import { FormStatus } from 'src/app/models/form.model';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {
  users: Array<UserProfile>;
  userRegistration: UserRegistration;
  formIndex: number;

  constructor(
    private route: ActivatedRoute, 
    private userRegSvc: UserRegistrationService
  ){
    this.formIndex = 0;
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.userRegSvc.getUserRegistration(id).subscribe((ur: UserRegistration) => {
      this.userRegistration = ur;
    });
  }

  setForm(index: number): void{
    this.formIndex = index;
  }

  getBgColor(status: FormStatus): string{
    switch(status){
      case FormStatus.Complete: return 'bg-green'
      case FormStatus.Submitted: return 'bg-yellow'
      case FormStatus.Incomplete: return 'bg-gray'
    }
  }

  getIcon(status: FormStatus): string{
    switch(status){
      case FormStatus.Complete: return 'check'
      case FormStatus.Submitted: return 'edit'
      case FormStatus.Incomplete: return 'assignment'
    }
  }
}
