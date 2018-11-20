import { Component, OnInit } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-sidebar-role-dock',
  templateUrl: './sidebar-role-dock.component.html',
  styleUrls: ['./sidebar-role-dock.component.scss']
})
export class SidebarRoleDockComponent implements OnInit {

  constructor() { }

  ngOnInit() {
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



