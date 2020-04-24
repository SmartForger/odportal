import { Component, OnInit, Input } from '@angular/core';
import { AppIconType } from 'src/app/models/app.model';
import { Container } from 'src/app/models/container.model';
import { UsersService } from 'src/app/services/users.service';
import { UserProfileKeycloak, UserProfile } from 'src/app/models/user-profile.model';
import { UserProfileService } from 'src/app/services/user-profile.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Breadcrumb } from '../../display-elements/breadcrumb.model';
import { BreadcrumbsService } from '../../display-elements/breadcrumbs.service';
import { userAccountContainer } from '../user-account-container'

@Component({
    selector: 'app-user-manager',
    templateUrl: './user-manager.component.html',
    styleUrls: ['./user-manager.component.scss']
})
export class UserManagerComponent implements OnInit {
    container: Container;
    pageTitle: string;
    profile: UserProfileKeycloak;

    constructor(
        private crumbSvc: BreadcrumbsService,
        private route: ActivatedRoute, 
        private router: Router,
        private userSvc: UsersService
    ){
        this.container = userAccountContainer;
        this.pageTitle = '';
    }

    ngOnInit() {
        this.userSvc.fetchById(this.route.snapshot.params['id']).subscribe(
            (user: UserProfileKeycloak) => {
                this.pageTitle = `Edit ${user.firstName} ${user.lastName}`;
                this.profile = user;
                this.generateCrumbs();
            },
            (err: any) => {
                console.log(err);
            }
        );
    }

    private generateCrumbs(): void {
        const crumbs: Array<Breadcrumb> = new Array<Breadcrumb>(
          {
            title: "Dashboard",
            active: false,
            link: "/portal"
          },
          {
            title: "User Manager",
            active: false,
            link: "/portal/user-manager"
          },  
          {
            title: this.profile.username,
            active: true,
            link: null
          }
        );
        this.crumbSvc.update(crumbs);
      }
}
