import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { DisplayElementsModule } from "../display-elements/display-elements.module";
import { FormElementsModule } from "../form-elements/form-elements.module";
import { MaterialModule } from "../../material.module";
import { MainComponent } from "./main/main.component";
import { EditBasicInfoComponent } from "./edit-basic-info/edit-basic-info.component";
import { EditPasswordComponent } from "./edit-password/edit-password.component";
import { LoginEventsComponent } from "./login-events/login-events.component";

const ROUTES: Routes = [
  {
    path: "",
    component: MainComponent
  }
];

@NgModule({
  declarations: [
    MainComponent,
    EditBasicInfoComponent,
    EditPasswordComponent,
    LoginEventsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DisplayElementsModule,
    FormElementsModule,
    MaterialModule,
    RouterModule.forChild(ROUTES)
  ]
})
export class UserProfileModule {}
