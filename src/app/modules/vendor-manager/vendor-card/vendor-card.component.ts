import { Component, OnInit, Input } from '@angular/core';

import { Vendor } from '../../../models/vendor.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-vendor-card',
  templateUrl: './vendor-card.component.html',
  styleUrls: ['./vendor-card.component.scss']
})
export class VendorCardComponent implements OnInit {

  @Input() vendor: Vendor;

  fileBasePath: string;

  constructor(private authSvc: AuthService) {
    this.vendor = {
      name: '',
      pocPhone: '',
      pocEmail: '',
    }
    this.fileBasePath = this.authSvc.globalConfig.vendorsServiceConnection + 'logos/';
  }

  ngOnInit() {
  }

}
