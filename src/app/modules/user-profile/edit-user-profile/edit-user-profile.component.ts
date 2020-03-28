import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { UserProfile } from 'src/app/models/user-profile.model';
import { EditBasicInfoComponent } from '../edit-basic-info/edit-basic-info.component';

@Component({
    selector: 'app-edit-user-profile',
    templateUrl: './edit-user-profile.component.html',
    styleUrls: ['./edit-user-profile.component.scss']
})
export class EditUserProfileComponent implements OnInit, AfterViewInit {

    @Input() profile: UserProfile;

    @ViewChild(EditBasicInfoComponent) private basicInfo: EditBasicInfoComponent;
    
    constructor() { }

    ngOnInit(){ }

    ngAfterViewInit() {
        this.basicInfo.setForm(this.profile);
    }

}
