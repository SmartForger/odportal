import { Component, OnInit } from '@angular/core';
import {FormGroup, Validators, FormControl, FormBuilder} from '@angular/forms';

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
      checkboxInput: new FormControl(false),
      numberInput: new FormControl('', [Validators.required, Validators.max(250), Validators.min(0)]),
      textareaInput: new FormControl(),
      selectInput: new FormControl()
    });
  }

}



