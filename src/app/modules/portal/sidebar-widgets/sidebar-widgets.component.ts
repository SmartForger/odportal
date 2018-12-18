import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-sidebar-widgets',
  templateUrl: './sidebar-widgets.component.html',
  styleUrls: ['./sidebar-widgets.component.scss']
})
export class SidebarWidgetsComponent implements OnInit {

  accountURL: string;

  constructor(private authSvc: AuthService) { }

  ngOnInit() {
    this.createAccountURL();
  }

  private createAccountURL(): void {
    this.accountURL = this.authSvc.getAccountURL();
    console.log(this.accountURL);
  }

}
