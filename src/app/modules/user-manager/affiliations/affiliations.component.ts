import { Component, OnInit } from '@angular/core';
import { DynamicallyRenderable } from 'src/app/interfaces/dynamically-renderable';
import { UserProfile } from 'src/app/models/user-profile.model';

@Component({
    selector: 'app-affiliations',
    templateUrl: './affiliations.component.html',
    styleUrls: ['./affiliations.component.scss']
})
export class AffiliationsComponent implements DynamicallyRenderable, OnInit {

    profile: UserProfile;

    constructor() { }

    ngOnInit() { }

    setState(state: any): void{
        this.profile = state;
    }
}
