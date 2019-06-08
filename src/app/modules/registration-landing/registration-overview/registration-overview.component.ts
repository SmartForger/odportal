import { Component, OnInit, Input, ViewEncapsulation} from '@angular/core';
import { Registration } from 'src/app/models/registration.model';

@Component({
  selector: 'app-registration-overview',
  templateUrl: './registration-overview.component.html',
  styleUrls: ['./registration-overview.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RegistrationOverviewComponent implements OnInit {

  @Input() registration: Registration;

  constructor() { }
  
  ngOnInit() {

  }

}
