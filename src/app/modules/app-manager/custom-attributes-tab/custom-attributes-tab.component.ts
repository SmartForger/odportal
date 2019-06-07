import {
  Component,
  OnInit,
  ViewChildren,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  Input
} from "@angular/core";
import { CustomAttributeCardComponent } from "../custom-attribute-card/custom-attribute-card.component";

@Component({
  selector: "app-custom-attributes-tab",
  templateUrl: "./custom-attributes-tab.component.html",
  styleUrls: ["./custom-attributes-tab.component.scss"]
})
export class CustomAttributesTabComponent implements OnInit {
  @Input() cardInfos: CustomAttributeInfo[] = [];
  @Output() onSave = new EventEmitter<CustomAttributeInfo[]>();
  @ViewChildren(CustomAttributeCardComponent)
  cards: CustomAttributeCardComponent[];

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {}

  add() {
    this.cardInfos.push({
      name: "",
      token: "",
      endPoint: "",
      apps: []
    });
    this.cdr.detectChanges();
  }

  removeAttribute(i) {
    this.cardInfos.splice(i, 1);
  }

  save() {
    this.onSave.emit(this.cards.map(card => card.form.value));
  }
}
