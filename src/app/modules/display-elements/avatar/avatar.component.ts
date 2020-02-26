import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent implements OnInit {
  @Input() icon: string;
  @Input() color: string;

  constructor() {
    this.icon = '';
    this.color = 'default';
  }

  ngOnInit() {
  }

}
