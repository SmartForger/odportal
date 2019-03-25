import { Component, OnInit, Input, Inject } from '@angular/core';
import {ButtonElement} from '../button-element.model';
import {MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  title: string;
  icons: Array<{icon: string, classList: string}>
  message: string;
  buttons: Array<ButtonElement>;
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { 
    if(data.title){this.title = data.title}
    else{this.title = ''}

    if(data.icons){this.icons = data.icons}
    else{this.icons = []}

    if(data.message){this.message = data.message}
    else{this.message = ''}

    if(data.buttons){this.buttons = data.buttons}
    else{this.buttons = []}
  }

  ngOnInit() {
  }
}
