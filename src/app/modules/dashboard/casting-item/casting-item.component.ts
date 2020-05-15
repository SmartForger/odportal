import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ElementRef,
} from "@angular/core";

@Component({
  selector: "app-casting-item",
  templateUrl: "./casting-item.component.html",
  styleUrls: ["./casting-item.component.scss"],
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

  constructor(private elementRef: ElementRef) {
    this.onDrop = new EventEmitter<string>();
    this.onDisconnect = new EventEmitter<any>();
  }

  ngOnInit() {}

  drag(ev: DragEvent) {
    ev.dataTransfer.setData("text/plain", this.id);
  }

  dragenter() {
    if (this.droppable) {
      this.hovering = true;
    }
  }

  dragleave(ev) {
    if (
      this.droppable &&
      (this.elementRef.nativeElement === ev.fromElement ||
        !this.elementRef.nativeElement.contains(ev.fromElement))
    ) {
      this.hovering = false;
    }
  }

  handleDrop(ev: DragEvent) {
    this.hovering = false;
    this.onDrop.emit(ev.dataTransfer.getData("text/plain"));
  }
}
