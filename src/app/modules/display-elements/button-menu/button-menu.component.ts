import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

type ButtonMenuVariant = 'default' | 'icon-dropdown';

@Component({
  selector: 'app-button-menu',
  templateUrl: './button-menu.component.html',
  styleUrls: ['./button-menu.component.scss']
})
export class ButtonMenuComponent implements OnInit {
  @Input() icon: string = '';
  @Input() title: string = '';
  @Input() options: any[] = [];
  @Input() current: any;
  @Input() variant: ButtonMenuVariant = 'default';
  @Output() selectItem: EventEmitter<any>;

  expanded = false;

  constructor() {
    this.selectItem = new EventEmitter<any>();
  }

  ngOnInit() {
  }

  toggle(ev) {
    if (ev && ev.stopPropagation) {
      ev.stopPropagation();
    }
    this.expanded = !this.expanded;
  }

  handleClick(ev) {
    ev.stopPropagation();
    this.selectItem.emit();
  }
}
