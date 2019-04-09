/**
 * @description Displays important information about apps
 * @author Steven M. Redman
 */

import { Component, OnInit, Input } from '@angular/core';
import {App} from '../../../models/app.model';
import {AuthService} from '../../../services/auth.service';
import { ApiCallDescriptor } from '../../../models/api-call-descriptor.model';

@Component({
  selector: 'app-descriptor',
  templateUrl: './descriptor.component.html',
  styleUrls: ['./descriptor.component.scss']
})
export class DescriptorComponent implements OnInit {

  @Input() app: App;

  constructor(private authSvc: AuthService) { }

  ngOnInit() {
    this.labelTrustedApiCalls();
  }

  private labelTrustedApiCalls(): void {
    if (!this.app.native && this.app.apiCalls) {
      this.authSvc.getCoreServicesArray().forEach((coreServiceUrl: string) => {
        this.app.apiCalls.filter((ac: ApiCallDescriptor) => !ac.requiresTrusted)
        .forEach((ac: ApiCallDescriptor) => {
          if (ac.verb.toLowerCase() !== "get" && ac.url.includes(coreServiceUrl)) {
            ac.requiresTrusted = true;
          }
          else {
            ac.requiresTrusted = false;
          }
        });
      });
    }
  }

}
