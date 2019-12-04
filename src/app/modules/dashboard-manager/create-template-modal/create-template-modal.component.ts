import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { KeyValue } from 'src/app/models/key-value.model';
import { UserDashboard } from 'src/app/models/user-dashboard.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-create-template-modal',
    templateUrl: './create-template-modal.component.html',
    styleUrls: ['./create-template-modal.component.scss']
})
export class CreateTemplateModalComponent implements OnInit {

    formGroup: FormGroup;
    readonly ROLES: Array<KeyValue> = [
        {display: 'Blue Cell', value: 'blue'},
        {display: 'Red Cell', value: 'red'},
        {display: 'White Cell', value: 'white'},
    ];
    @Output() dashboard: EventEmitter<UserDashboard>;

    constructor(private authSvc: AuthService) {
        this.dashboard = new EventEmitter<UserDashboard>();
        this.formGroup = new FormGroup({
            role: new FormControl('none', Validators.required),
            title: new FormControl('', [Validators.required, Validators.maxLength(256)])
        });
    }

    ngOnInit() {
    }

    close(dash: UserDashboard): void{
        this.dashboard.emit(dash);
    }

    save(): void{
        this.close({
            default: false,
            description: '',
            gridItems: [ ],
            isTemplate: true,
            templateRole: this.formGroup.controls['role'].value,
            title: this.formGroup.controls['title'].value,
            userId: this.authSvc.getUserId()
        });
    }
}
