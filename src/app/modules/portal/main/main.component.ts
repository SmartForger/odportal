import { Component, OnInit } from '@angular/core';
import {FormGroup, Validators, FormControl, FormBuilder} from '@angular/forms';

declare var $: any;

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  formGroup: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.buildForm();
  }

  private buildForm(): void {
    this.formGroup = this.formBuilder.group({
      textInput: new FormControl('', [Validators.required, Validators.maxLength(250)]),
      checkboxInput: new FormControl(false)
    });
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


