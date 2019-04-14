import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit {

  @Output() close: EventEmitter<void>;

  constructor() { 
    this.close = new EventEmitter<void>();
  }

  ngOnInit() {
  }

  closeClicked(): void {
    this.close.emit();
  }

}
