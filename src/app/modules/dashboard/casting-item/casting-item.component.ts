import { Component, OnInit, Input, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-casting-item',
  templateUrl: './casting-item.component.html',
  styleUrls: ['./casting-item.component.scss']
})
export class CastingItemComponent implements OnInit {
  @Input() id: string = "";
  @Input() title: string = "";
  @Input() subtitle: string = "";
  @Input() icon: string = "";
  @Input() draggable: boolean = false;
  @Input() droppable: boolean = false;
  @Input() showDisconnect: boolean = false;

  @Output() onDrop: EventEmitter<string>;
  @Output() onDisconnect: EventEmitter<any>;

  hovering = false;

  constructor(private cdRef: ChangeDetectorRef) {
    this.onDrop = new EventEmitter<string>();
    this.onDisconnect = new EventEmitter<any>();
  }

  ngOnInit() {
  }

  drag(ev: DragEvent) {
    ev.dataTransfer.setData('text/plain', this.id);
  }

  dragenter() {
    if (this.droppable) {
      this.hovering = true;
    }
  }

  dragleave() {
    if (this.droppable) {
      this.hovering = false;
      this.cdRef.detectChanges();
    }
  }

  handleDrop(ev: DragEvent) {
    this.hovering = false;
    this.onDrop.emit(ev.dataTransfer.getData("text/plain"));
  }
}
