import { Component, OnInit } from '@angular/core';
import { DynamicallyRenderable } from 'src/app/interfaces/dynamically-renderable';
import { UserProfile, OrganizationMembership } from 'src/app/models/user-profile.model';

@Component({
    selector: 'app-affiliations',
    templateUrl: './affiliations.component.html',
    styleUrls: ['./affiliations.component.scss']
})
export class AffiliationsComponent implements DynamicallyRenderable, OnInit {

    profile: UserProfile;

    readonly DISPLAYED_COLUMNS = ['organization', 'role', 'action']

    constructor() { }

    ngOnInit() { }

    add(): void{
        
    }

    remove(affiliation: OrganizationMembership): void{
        
    }

    setState(state: any): void{
        this.profile = state;
    }
}
