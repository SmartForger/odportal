import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";

// Modules
import { MaterialModule } from "../../material.module";
import { MatPasswordStrengthModule } from '@angular-material-extensions/password-strength';

// Components
import { MainComponent } from "./main/main.component";
import { RegistrationLandingComponent } from "./registration-landing/registration-landing.component";
import { RegistrationOverviewComponent } from "./registration-overview/registration-overview.component";
import { RegistrationAccountTypeComponent } from "./registration-account-type/registration-account-type.component";
import { RegistrationBasicInfoComponent } from "./registration-basic-info/registration-basic-info.component";

import {SafeHtmlPipe} from "../custom-pipes/safe-html.pipe";

const ROUTES: Routes = [
  {
    path: "",
    component: MainComponent,
    children: [
      {
        path: "",
        pathMatch: "full",
        component: RegistrationLandingComponent
      },
      {
        path: "registration/overview",
        component: RegistrationOverviewComponent
      },
      {
        path: "registration/account-type",
        component: RegistrationAccountTypeComponent
      },
      {
        path: "registration/basic-info",
        component: RegistrationBasicInfoComponent
      },
      {
        path: "registration",
        redirectTo: "registration/overview",
        pathMatch: "full"
      }
    ]
  }
];

@NgModule({
  declarations: [
    MainComponent,
    RegistrationLandingComponent,
    RegistrationOverviewComponent,
    RegistrationAccountTypeComponent,
    RegistrationBasicInfoComponent,
    SafeHtmlPipe
  ],
  imports: [
    CommonModule, 
    MaterialModule, 
    MatPasswordStrengthModule,
    RouterModule.forChild(ROUTES)]
})
export class RegistrationLandingModule {}
