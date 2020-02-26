import { Component, OnInit, ViewChild } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import { UserProfile } from "src/app/models/user-profile.model";
import { Breadcrumb } from "../../display-elements/breadcrumb.model";
import { BreadcrumbsService } from "../../display-elements/breadcrumbs.service";
import { EditBasicInfoComponent } from "../edit-basic-info/edit-basic-info.component";

@Component({
  selector: "app-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.scss"]
})
export class MainComponent implements OnInit {
  @ViewChild(EditBasicInfoComponent) private basicInfo: EditBasicInfoComponent;

  profile: UserProfile;

  constructor(
    private crumbsSvc: BreadcrumbsService,
    private authSvc: AuthService
  ) {
    this.profile = {
      firstName: "",
      lastName: "",
      username: "",
      email: ""
    };
  }

  ngOnInit() {
    this.loadUserProfile();
    this.generateCrumbs();
  }

  get pageTitle() {
    return this.profile ? `${this.profile.username}'s profile` : '';
  }

  private loadUserProfile() {
    this.authSvc
      .getUserProfile()
      .then((profile: UserProfile) => {
        this.profile = profile;
        this.profile.id = this.authSvc.getUserId();
        this.basicInfo.setForm(this.profile);
      })
      .catch(err => {
        console.log("Error loading profile...", err);
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
        title: "Profile",
        active: true,
        link: "/portal/profile"
      }
    );
    this.crumbsSvc.update(crumbs);
  }
}
