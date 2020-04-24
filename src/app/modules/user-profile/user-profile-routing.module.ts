import { RouterModule, Routes } from "@angular/router";
import { ProfileComponent } from "./profile/profile.component";
import { NgModule } from "@angular/core";

const PROFILE_ROUTES: Routes = [
    {
        path: "",
        component: ProfileComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(PROFILE_ROUTES)],
    exports: [RouterModule]
})
export class UserProfileRoutingModule { }