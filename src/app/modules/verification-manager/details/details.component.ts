import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Form, RegistrationSection } from 'src/app/models/form.model';
import { VerificationService } from 'src/app/services/verification.service';
import { BreadcrumbsService } from '../../display-elements/breadcrumbs.service';
import { Breadcrumb } from '../../display-elements/breadcrumb.model';
import { UserProfileKeycloak, UserProfile } from 'src/app/models/user-profile.model';
import { UserProfileService } from 'src/app/services/user-profile.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  
  forms: Array<Form>;
  formIndex: number;
  regId: string;
  userProfile: UserProfileKeycloak;

  constructor(
    private crumbsSvc: BreadcrumbsService,
    private route: ActivatedRoute, 
    private verSvc: VerificationService
  ) { 
    this.forms = new Array<Form>();
    this.formIndex = 0;
  }

  ngOnInit() {
    this.regId = this.route.snapshot.paramMap.get('id');
    this.verSvc.getUserProfile(this.regId).subscribe((userProfile: UserProfileKeycloak) => {
      console.log(userProfile);
      this.userProfile = userProfile;
      this.generateCrumbs();
    });
    this.verSvc.getForms(this.regId).subscribe((formResult: Array<Form>) => this.forms = formResult);
  }

  setForm(index: number): void{
    this.formIndex = index;
  }
  
  onSubmit(section: RegistrationSection): void{
    console.log('SUBMISSION');
    console.log(section);
    this.verSvc.submitSection(this.regId, this.forms[this.formIndex].docId, section).subscribe((form: Form) => {
      this.forms[this.formIndex] = form;
    });
  }

  private generateCrumbs(): void {
    const crumbs: Array<Breadcrumb> = new Array<Breadcrumb>(
      {
        title: "Dashboard",
        active: false,
        link: "/portal"
      },
      {
        title: "Verification Manager",
        active: false,
        link: "/portal/verification"
      },
      {
        title: this.userProfile.username,
        active: true,
        link: `/portal/verification/users/${this.regId}`
      }
    );
    this.crumbsSvc.update(crumbs);
  }
}