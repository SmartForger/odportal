import { Component, OnInit } from '@angular/core';
import {FormGroup, Validators, FormControl, FormBuilder} from '@angular/forms';

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

  toggleNav(): void {
    $('#page-wrapper').toggleClass('minimize');
    $('#side-menu').toggleClass('menu-minimize');
    $('#menu').toggleClass('menu-expand');
    $('#side-menu').toggleClass('overflow-y-lg');
    $('#nav-icon').toggleClass('icon-expand-nav');
  }

  toggleSkin(): void {
    $('#skin-change').toggleClass('dark');
  }

  toggleSkinContrast(): void {
    $('#skin-change').toggleClass('contrast');
  }

  ngAfterViewInit() {
    this.removeSkin(); 
    this.removeSkinB(); 
  }
  
  private removeSkin(): void {
    $('.skin-positionContrast').click(() => {
      $('#skin-change').removeClass('dark');
    });
  }

  private removeSkinB(): void {
    $('.skin-positionDark').click(() => {
      $('#skin-change').removeClass('contrast');
    });
  }

}

