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

  toggleSlideoutNotifications(): void {
    $('#slideout_innerNotifications').toggleClass('expanded');
  }

  toggleSlideoutCalendar(): void {
    $('#slideout_innerCalendar').toggleClass('expanded');
  }
  
  toggleSlideoutHelp(): void {
    $('#slideout_innerHelp').toggleClass('expanded');
  }

  toggleSlideoutFeedback(): void {
    $('#slideout_innerFeedback').toggleClass('expanded');
  }

  ngAfterViewInit() {

    this.pageWrapperCollapseNotifications(); 
    this.logoAreaNotifications(); 
    this.overflowYNotifications(); 
    this.rmfWidgetsBgNotifications(); 
    this.closeWidgetNotifications(); 
    this.closeNotifications(); 
    this.btnCloseBlockNotifications();
    this.redBtnCloseNotifications();

    this.pageWrapperCollapseCalendar(); 
    this.logoAreaCalendar(); 
    this.overflowYCalendar(); 
    this.rmfWidgetsBgCalendar(); 
    this.closeWidgetCalendar(); 
    this.closeCalendar(); 
    this.btnCloseBlockCalendar();
    this.redBtnCloseCalendar();
    
    this.pageWrapperCollapseHelp(); 
    this.logoAreaHelp(); 
    this.overflowYHelp(); 
    this.rmfWidgetsBgHelp(); 
    this.closeWidget(); 
    this.closeHelp(); 
    this.btnCloseBlock();
    this.redBtnClose();

    this.pageWrapperCollapseFeedback(); 
    this.logoAreaFeedback(); 
    this.overflowYFeedback(); 
    this.rmfWidgetsBgFeedback(); 
    this.closeWidgetFeedback(); 
    this.closeFeedback(); 
    this.btnCloseBlockFeedback();
    this.redBtnCloseFeedback();
  }

  private pageWrapperCollapseNotifications(): void {
    $('#page-wrapper').click(() => {
      $('#slideout_innerNotifications').removeClass('expanded');
    });
  }

  private logoAreaNotifications(): void {
    $('.logo-area').click(() => {
      $('#slideout_innerNotifications').removeClass('expanded');
    });
  }

  private overflowYNotifications(): void {
    $('.overflow-y').click(() => {
      $('#slideout_innerNotifications').removeClass('expanded');
    });
  }

  private rmfWidgetsBgNotifications(): void {
    $('.footer-icon-bg').click(() => {
      $('#slideout_innerNotifications').removeClass('expanded');
    });
  }

  private closeWidgetNotifications(): void {
    $('.desktop-only-role').click(() => {
      $('#slideout_innerNotifications').removeClass('expanded');
    });
  }

  private closeNotifications(): void {
    $('.closeHelp').click(() => {
      $('#slideout_innerNotifications').removeClass('expanded');
    });
  }

  private btnCloseBlockNotifications(): void {
    $('.user-block').click(() => {
      $('#slideout_innerNotifications').removeClass('expanded');
    });
  }

  private redBtnCloseNotifications(): void {
    $('.redBtnClose').click(() => {
      $('#slideout_innerNotifications').removeClass('expanded');
    });
  }

  private pageWrapperCollapseCalendar(): void {
    $('#page-wrapper').click(() => {
      $('#slideout_innerCalendar').removeClass('expanded');
    });
  }

  private logoAreaCalendar(): void {
    $('.logo-area').click(() => {
      $('#slideout_innerCalendar').removeClass('expanded');
    });
  }

  private overflowYCalendar(): void {
    $('.overflow-y').click(() => {
      $('#slideout_innerCalendar').removeClass('expanded');
    });
  }

  private rmfWidgetsBgCalendar(): void {
    $('.footer-icon-bg').click(() => {
      $('#slideout_innerCalendar').removeClass('expanded');
    });
  }

  private closeWidgetCalendar(): void {
    $('.desktop-only-role').click(() => {
      $('#slideout_innerCalendar').removeClass('expanded');
    });
  }

  private closeCalendar(): void {
    $('.closeHelp').click(() => {
      $('#slideout_innerCalendar').removeClass('expanded');
    });
  }

  private btnCloseBlockCalendar(): void {
    $('.user-block').click(() => {
      $('#slideout_innerCalendar').removeClass('expanded');
    });
  }

  private redBtnCloseCalendar(): void {
    $('.redBtnClose').click(() => {
      $('#slideout_innerCalendar').removeClass('expanded');
    });
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

  private redBtnClose(): void {
    $('.redBtnClose').click(() => {
      $('#slideout_innerHelp').removeClass('expanded');
    });
  }

  private pageWrapperCollapseFeedback(): void {
    $('#page-wrapper').click(() => {
      $('#slideout_innerFeedback').removeClass('expanded');
    });
  }

  private logoAreaFeedback(): void {
    $('.logo-area').click(() => {
      $('#slideout_innerFeedback').removeClass('expanded');
    });
  }

  private overflowYFeedback(): void {
    $('.overflow-y').click(() => {
      $('#slideout_innerFeedback').removeClass('expanded');
    });
  }

  private rmfWidgetsBgFeedback(): void {
    $('.footer-icon-bg').click(() => {
      $('#slideout_innerFeedback').removeClass('expanded');
    });
  }

  private closeWidgetFeedback(): void {
    $('.desktop-only-role').click(() => {
      $('#slideout_innerFeedback').removeClass('expanded');
    });
  }

  private closeFeedback(): void {
    $('.closeHelp').click(() => {
      $('#slideout_innerFeedback').removeClass('expanded');
    });
  }

  private btnCloseBlockFeedback(): void {
    $('.user-block').click(() => {
      $('#slideout_innerFeedback').removeClass('expanded');
    });
  }

  private redBtnCloseFeedback(): void {
    $('.redBtnClose').click(() => {
      $('#slideout_innerFeedback').removeClass('expanded');
    });
  }

}
