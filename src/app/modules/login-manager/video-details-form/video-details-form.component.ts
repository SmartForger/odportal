import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-video-details-form',
  templateUrl: './video-details-form.component.html',
  styleUrls: ['./video-details-form.component.scss']
})
export class VideoDetailsFormComponent implements OnInit {
  @Input() form: FormGroup;
  @Output() next: EventEmitter<any>;

  keywords: string[] = [];
  name: string = '';
  description: string = '';

  constructor(private formBuilder: FormBuilder) {
    this.next = new EventEmitter();
  }

  ngOnInit() {
  }

  nextStep() {
    this.next.emit();
  }

}
