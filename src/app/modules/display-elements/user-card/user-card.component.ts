import { Component, OnInit, Input } from '@angular/core';
import { UserProfile } from '../../../models/user-profile.model';

@Component({
    selector: 'app-user-card',
    templateUrl: './user-card.component.html',
    styleUrls: ['./user-card.component.scss']
})
export class UserCardComponent implements OnInit {

    @Input() user: UserProfile;

    constructor() {
        this.user = {
            firstName: '',
            lastName: '',
            username: '',
            email: ''
        };
    }

    ngOnInit() { }
}
