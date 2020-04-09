import { Component, OnInit } from '@angular/core';
import { Container } from 'src/app/models/container.model';
import { AppIconType } from 'src/app/models/app.model';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

    readonly container: Container = {
        branches: [
            {
                apps: ['feedback-manager', 'micro-app-manager', 'app-deployment'],
                icon: 'person',
                iconType: AppIconType.ICON,
                title: "Branch A"
            },
            {
                apps: ['notification-manager', 'user-profile', 'registration-manager', 'verification-manager'],
                icon: 'warning',
                iconType: AppIconType.ICON,
                title: "Branch B"
            }
        ],
        root: null
    };

    constructor() { }

    ngOnInit() {
    }

}
