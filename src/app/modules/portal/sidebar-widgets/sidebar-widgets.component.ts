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
    $('#slideout_innerWidgets').toggleClass('expanded');
  }

  ngAfterViewInit() {
    this.pageWrapperCollapseB(); 
    this.logoAreaB(); 
    this.overflowYB(); 
    this.rmfWidgetsBgB(); 
    this.closeWidget(); 
    this.btnCloseSlider(); 
    this.redClose(); 
    this.slideoutClose(); 
  }

  private pageWrapperCollapseB(): void {
    $('#page-wrapper').click(() => {
      $('#slideout_innerWidgets').removeClass('expanded');
    });
  }

  private logoAreaB(): void {
    $('.logo-area').click(() => {
      $('#slideout_innerWidgets').removeClass('expanded');
    });
  }

  private overflowYB(): void {
    $('.overflow-y').click(() => {
      $('#slideout_innerWidgets').removeClass('expanded');
    });
  }

  private rmfWidgetsBgB(): void {
    $('.footer-icon-bg').click(() => {
      $('#slideout_innerWidgets').removeClass('expanded');
    });
  }

  private closeWidget(): void {
    $('.desktop-only-role').click(() => {
      $('#slideout_innerWidgets').removeClass('expanded');
    });
  }

  private btnCloseSlider(): void {
    $('.btnCloseSlider').click(() => {
      $('#slideout_innerWidgets').removeClass('expanded');
    });
  }

  private redClose(): void {
    $('.redCloseBtn').click(() => {
      $('#slideout_innerWidgets').removeClass('expanded');
    });
  }

  private slideoutClose(): void {
    $('.closeSlideout').click(() => {
      $('#slideout_innerWidgets').removeClass('expanded');
    });
  }

}
