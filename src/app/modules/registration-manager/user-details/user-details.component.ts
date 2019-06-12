import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserRegistration } from 'src/app/models/user-registration.model';
import { UserRegistrationService } from 'src/app/services/user-registration.service';
import { UserProfile } from 'src/app/models/user-profile.model';
import { FormStatus } from 'src/app/models/form.model';
import { MatTabGroup } from '@angular/material';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {
  userRegistration: UserRegistration;
  stepIndex: number;
  formIndex: number;

  @ViewChild(MatTabGroup) tabs: MatTabGroup;

  constructor(
    private route: ActivatedRoute, 
    private userRegSvc: UserRegistrationService
  ){
    this.userRegistration = null;
    this.stepIndex = 0;
    this.formIndex = 0;
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.userRegSvc.getUserRegistration(id).subscribe((ur: UserRegistration) => {
      this.userRegistration = ur;
    });
  }

  setStep(index: number): void{
    this.stepIndex = index;
    this.formIndex = 0;
  }

  setForm(index: number): void{
    this.formIndex = index;
  }

  goToStep(stepIndex: number): void{
    this.stepIndex = stepIndex;
    this.tabs.selectedIndex = stepIndex + 1;
  }

  goToForm(formIndex: number): void{
    this.formIndex = formIndex;
    this.goToStep(this.stepIndex);
  }
}
