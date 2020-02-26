import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Vendor } from 'src/app/models/vendor.model';

@Component({
  selector: 'app-vendor-icon',
  templateUrl: './vendor-icon.component.html',
  styleUrls: ['./vendor-icon.component.scss']
})
export class VendorIconComponent implements OnInit {
  @Input()
  set vendorImage(img: string) {
    if (img) {
      this.imageSrc = this.authSvc.globalConfig.vendorsServiceConnection + 'logos/' + img;
    } else {
      this.imageSrc = '';
    }
  }

  @Input() wide: boolean;

  private _size = 0;
  get size() {
    return this._size;
  }
  @Input()
  set size(val: number) {
    let size = 30;
    if (Number.isInteger(val)) {
      size = Math.max(val, 30);
    }

    this._size = size;
    this.iconStyle = {
      fontSize: (size * 0.7) + 'px',
      height: size + 'px',
      lineHeight: size + 'px',
      width: this.wide ? '100%' : size + 'px'
    };
  }
  
  imageSrc: String;
  iconStyle: any = {
    fontSize: '21px',
    height: '30px',
    lineHeight: '30px',
    width: '30px'
  };

  constructor(private authSvc: AuthService) {
  }

  ngOnInit() {
  }

}
