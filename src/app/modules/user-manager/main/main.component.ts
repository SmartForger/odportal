import { Component, OnInit } from '@angular/core';
import { Container } from 'src/app/models/container.model';
import { AppIconType } from 'src/app/models/app.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

    userId: string;

    constructor(private authSvc: AuthService) {
        this.userId = this.authSvc.getUserId();
    }

    ngOnInit() { }

}
