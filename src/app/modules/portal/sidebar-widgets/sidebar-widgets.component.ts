import { Component, OnInit } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-sidebar-widgets',
  templateUrl: './sidebar-widgets.component.html',
  styleUrls: ['./sidebar-widgets.component.scss']
})
export class SidebarWidgetsComponent implements OnInit {

  accountURL: string;

  constructor() { }

  ngOnInit() {
  }

  toggleSlideoutB(): void {
    $('#slideout_innerB').toggleClass('expanded');
  }

  ngAfterViewInit() {
    this.pageWrapperCollapseB(); 
    this.logoAreaB(); 
    this.overflowYB(); 
    this.rmfWidgetsBgB(); 
    this.closeWidget(); 
    this.btnCloseSlider(); 
  }

  private pageWrapperCollapseB(): void {
    $('#page-wrapper').click(() => {
      $('#slideout_innerB').removeClass('expanded');
    });
  }

  private logoAreaB(): void {
    $('.logo-area').click(() => {
      $('#slideout_innerB').removeClass('expanded');
    });
  }

  private overflowYB(): void {
    $('.overflow-y').click(() => {
      $('#slideout_innerB').removeClass('expanded');
    });
  }

  private rmfWidgetsBgB(): void {
    $('.footer-icon-bg').click(() => {
      $('#slideout_innerB').removeClass('expanded');
    });
  }

  private closeWidget(): void {
    $('.desktop-only-role').click(() => {
      $('#slideout_innerB').removeClass('expanded');
    });
  }

  private btnCloseSlider(): void {
    $('.btnCloseSlider').click(() => {
      $('#slideout_innerB').removeClass('expanded');
    });
  }

}
