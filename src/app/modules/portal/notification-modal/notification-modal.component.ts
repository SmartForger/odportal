import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notification-modal',
  templateUrl: './notification-modal.component.html',
  styleUrls: ['./notification-modal.component.scss']
})
export class NotificationModalComponent implements OnInit {

  isHidden: boolean;

  constructor() { 
    this.isHidden = true;
  }

  ngOnInit() {
  }

  hideShow() {
    this.isHidden = !this.isHidden;
  }

}
