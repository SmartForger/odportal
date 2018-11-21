import { Component, OnInit } from '@angular/core';
<<<<<<< HEAD
=======
import {FormGroup, Validators, FormControl, FormBuilder} from '@angular/forms';
>>>>>>> 200dddd6067c0391608a85d6f9022ccc9f064660

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

<<<<<<< HEAD
  constructor() { }

  ngOnInit() {
  }

}
=======
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



}


>>>>>>> 200dddd6067c0391608a85d6f9022ccc9f064660
