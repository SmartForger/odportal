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
  }


  ngAfterViewInit() {

    }


}

