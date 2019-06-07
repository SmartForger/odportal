import { Component, OnInit, Input, ViewEncapsulation} from '@angular/core';
import { Registration } from 'src/app/models/registration.model';

@Component({
  selector: 'app-registration-overview',
  templateUrl: './registration-overview.component.html',
  styleUrls: ['./registration-overview.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RegistrationOverviewComponent implements OnInit {

  @Input() registration: Registration;

  constructor() { 
    this.registration = {
      docId: "fake-reg-id",
      title: "PCTE General User Registration",
      isLinear: false,
      default: true,
      overview: [ ],
      steps: [ ]
    };
    this.registration.overview = [
      {
        title: "Basic Information Collected",
        content: `
          <img src="../../../../assets/registration/basic-information.jpg" class="registration-steps-sm">
          <p>
            Basic information is collected in order to create a PCTE account.
          </p>
          <p>
            Basic information can be collected by entering details directly or importing those details via CAC/ECA. If users choose to enter basic information directly, they will still be required to login with CAC credentials prior to registration.
          </p>`
      },
      {
        title: "Login to Registration Portal",
        content: `
          <img src="../../../../assets/registration/login.jpg" class="registration-steps-left-sm">
          <p>After submitting basic information, users will be redirected to the registration portal login page to continue the registration process.</p>`
      },
      {
        title: "Additional User Information Collected",
        content: `
          <img src="../../../../assets/registration/additional-information.jpg" class="registration-steps-sm">
          <p>Users will be presented with the "My Registration" microapplication.</p>
          <p>The "My Registration" microapplication consists of a wizard that guides users through the different forms that are required to register for PCTE.</p>
          <p>The steps of the registration wizard include:</p>
          <ul>
            <li>Basic Information</li>
            <li>Required Forms</li>
            <li>Certifications</li>
          </ul>
          <p>General User forms include:</p>
          <ul>
            <li>System Authorization Access Form (SAAR DD2875)</li>
            <li> Acceptable Use Policy</li>
            <li>PCTE NDA</li>
          </ul>
       `
      },
      {
        title: "Verification & Supporting Items",
        content: `
          <img src="../../../../assets/registration/approval.jpg" class="registration-steps-left-sm">
          <p>Administrators, Supervisors, FSOs and IAOs will be reviewing the application details and will notify the applicant if any issues occur.</p>
          <p>Once fully approved, users will be notified and can access PCTE using the same login credentials that were created at the beginning of the registration process.</p>`
      }
    ]
  }
  
  ngOnInit() {

  }

}
