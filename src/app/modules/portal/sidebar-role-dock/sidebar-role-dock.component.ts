import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../../services/auth.service';

declare var $: any;

@Component({
  selector: 'app-sidebar-role-dock',
  templateUrl: './sidebar-role-dock.component.html',
  styleUrls: ['./sidebar-role-dock.component.scss']
})
export class SidebarRoleDockComponent implements OnInit {

  roles: Array<string>;

  constructor(private authSvc: AuthService) { 
    this.roles = new Array<string>();
  }

  ngOnInit() {
    this.loadRoles();
  }

  toggleSlideout(): void {
    $('#slideout_inner').toggleClass('expanded');
  }


  ngAfterViewInit() {
    this.pageWrapperCollapse(); 
    this.logoArea(); 
    this.overflowY(); 
    this.rmfWidgetsBg(); 
    this.closeRole(); 
    this.btnCloseSlider(); 
  }

  private loadRoles(): void {
    this.roles = this.authSvc.getRealmRoles();
  }

  private pageWrapperCollapse(): void {
    $('#page-wrapper').click(() => {
      $('#slideout_inner').removeClass('expanded');
    });
  }


  private logoArea(): void {
    $('.logo-area').click(() => {
      $('#slideout_inner').removeClass('expanded');
    });
  }

  private overflowY(): void {
    $('.overflow-y').click(() => {
      $('#slideout_inner').removeClass('expanded');
    });
  }


  private rmfWidgetsBg(): void {
    $('.footer-icon-bg').click(() => {
      $('#slideout_inner').removeClass('expanded');
    });
  }


  private closeRole(): void {
    $('.desktop-only-widget').click(() => {
      $('#slideout_inner').removeClass('expanded');
    });
  }

  private btnCloseSlider(): void {
    $('.btnCloseSlider').click(() => {
      $('#slideout_inner').removeClass('expanded');
    });
  }


}



