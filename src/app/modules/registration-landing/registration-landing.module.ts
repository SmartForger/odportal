import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";

// Modules
import { MaterialModule } from "../../material.module";

// Components
import { MainComponent } from "./main/main.component";
import { RegistrationLandingComponent } from "./registration-landing/registration-landing.component";
import { RegistrationOverviewComponent } from "./registration-overview/registration-overview.component";
import { RegistrationAccountTypeComponent } from "./registration-account-type/registration-account-type.component";
import { RegistrationBasicInfoComponent } from "./registration-basic-info/registration-basic-info.component";

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
    RegistrationBasicInfoComponent
  ],
  imports: [CommonModule, MaterialModule, RouterModule.forChild(ROUTES)]
})
export class RegistrationLandingModule {}
