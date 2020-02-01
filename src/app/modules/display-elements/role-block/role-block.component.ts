import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-role-block',
  templateUrl: './role-block.component.html',
  styleUrls: ['./role-block.component.scss']
})
export class RoleBlockComponent implements OnInit {
  @Input() name: string;
  @Input() active: boolean;

  @Output() status: EventEmitter<boolean>;

  constructor() {
    this.active = false;
    this.name = "";
    this.status = new EventEmitter<boolean>();
  }

  ngOnInit() {
  }

  emitStatus(){
      this.status.emit(!this.active);
  }
}
