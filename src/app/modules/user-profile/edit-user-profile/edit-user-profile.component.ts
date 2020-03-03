import { Component, OnInit, Input } from '@angular/core';
import { UserProfile } from 'src/app/models/user-profile.model';

@Component({
    selector: 'app-edit-user-profile',
    templateUrl: './edit-user-profile.component.html',
    styleUrls: ['./edit-user-profile.component.scss']
})
export class EditUserProfileComponent implements OnInit {

    @Input() profile: UserProfile;

    constructor() { }

    ngOnInit() {
    }

}
