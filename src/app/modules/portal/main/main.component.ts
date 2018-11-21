import { Component, OnInit } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    
  }

  ngAfterViewInit() {
    this.btnModal(); 
    this.closeModal(); 
    this.footerCloseModal(); 
  }

  private btnModal(): void {
    $('#btn-modal').click(() => {
      $('#rmf-modal').removeClass('display-none');
    });
  }

  private closeModal(): void {
    $('#close-modal').click(() => {
      $('#rmf-modal').toggleClass('display-none');
    });
  }

  private footerCloseModal(): void {
    $('#footer-close-modal').click(() => {
      $('#rmf-modal').toggleClass('display-none');
    });
  }


}


