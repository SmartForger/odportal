import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-role-block',
  templateUrl: './role-block.component.html',
  styleUrls: ['./role-block.component.scss']
})
export class RoleBlockComponent implements OnInit {
  @Input() name: string;
  @Input() active: boolean;

  constructor() {
    this.name = "";
    this.active = false;
  }

  ngOnInit() {
  }

}
