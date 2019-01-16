import { Component, OnInit } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  toggleSlideoutHelp(): void {
    $('#slideout_innerHelp').toggleClass('expanded');
  }

  ngAfterViewInit() {
    this.pageWrapperCollapseHelp(); 
    this.logoAreaHelp(); 
    this.overflowYHelp(); 
    this.rmfWidgetsBgHelp(); 
    this.closeWidget(); 
    this.closeHelp(); 
    this.btnCloseBlock();
    this.btnCloseFooterDock();
  }

  private pageWrapperCollapseHelp(): void {
    $('#page-wrapper').click(() => {
      $('#slideout_innerHelp').removeClass('expanded');
    });
  }

  private logoAreaHelp(): void {
    $('.logo-area').click(() => {
      $('#slideout_innerHelp').removeClass('expanded');
    });
  }

  private overflowYHelp(): void {
    $('.overflow-y').click(() => {
      $('#slideout_innerHelp').removeClass('expanded');
    });
  }

  private rmfWidgetsBgHelp(): void {
    $('.footer-icon-bg').click(() => {
      $('#slideout_innerHelp').removeClass('expanded');
    });
  }

  private closeWidget(): void {
    $('.desktop-only-role').click(() => {
      $('#slideout_innerHelp').removeClass('expanded');
    });
  }

  private closeHelp(): void {
    $('.closeHelp').click(() => {
      $('#slideout_innerHelp').removeClass('expanded');
    });
  }

  private btnCloseBlock(): void {
    $('.user-block').click(() => {
      $('#slideout_innerHelp').removeClass('expanded');
    });
  }

  private btnCloseFooterDock(): void {
    $('.footer-dock-widget').click(() => {
      $('#slideout_innerHelp').removeClass('expanded');
    });
  }

}
