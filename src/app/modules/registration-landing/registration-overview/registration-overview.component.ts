import { Component, OnInit, OnDestroy, ViewEncapsulation} from '@angular/core';
import { Registration } from 'src/app/models/registration.model';
import {RegistrationService} from '../../../services/registration.service';
import {AuthService} from '../../../services/auth.service';
import {Subscription} from 'rxjs';
import {GlobalConfig} from '../../../models/global-config.model';

@Component({
  selector: 'app-registration-overview',
  templateUrl: './registration-overview.component.html',
  styleUrls: ['./registration-overview.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RegistrationOverviewComponent implements OnInit, OnDestroy {

  registration: Registration;
  private gcSub: Subscription;

  constructor(private regSvc: RegistrationService, private authSvc: AuthService) { }
  
  ngOnInit() {
    this.gcSub = this.authSvc.observeGlobalConfigUpdates().subscribe(
      (gc: GlobalConfig) => {
        if (gc) {
          this.fetchDefaultRegistration();
        }
      }
    );
  }

  ngOnDestroy() {
    if (this.gcSub) {
      this.gcSub.unsubscribe();
    }
  }

  private fetchDefaultRegistration(): void {
    this.regSvc.fetchDefault().subscribe(
      (reg: Registration) => {
        this.registration = reg;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

}
