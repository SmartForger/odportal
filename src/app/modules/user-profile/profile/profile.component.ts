import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import { UserProfileKeycloak } from "src/app/models/user-profile.model";
import { Breadcrumb } from "../../display-elements/breadcrumb.model";
import { BreadcrumbsService } from "../../display-elements/breadcrumbs.service";
import { userAccountContainer } from "../../user-manager/user-account-container";
import { Container } from "src/app/models/container.model";

@Component({
    selector: "app-profile",
    templateUrl: "./profile.component.html",
    styleUrls: ["./profile.component.scss"]
})
export class ProfileComponent implements OnInit {

    container: Container;
    profile: UserProfileKeycloak;

    constructor(private authSvc: AuthService, private crumbsSvc: BreadcrumbsService) {
        this.container = userAccountContainer;
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
            .then((profile: UserProfileKeycloak) => {
                console.log('profile: ', profile);
                this.profile = profile;
                this.profile.id = this.authSvc.getUserId();
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
