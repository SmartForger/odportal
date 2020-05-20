import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class TableSelectionService {
  selection: BehaviorSubject<Object>;

  private items: Array<any>;
  private compareField: string;

  constructor() {
    this.items = [];
    this.compareField = "id";
    this.selection = new BehaviorSubject<Object>({});
  }

  toggleItem(item) {
    const index = this.items.findIndex(
      (_item) => _item[this.compareField] === item[this.compareField]
    );

    if (index >= 0) {
      this.items.splice(index, 1);
    } else {
      this.items.push(item);
    }

    const selection = {};
    this.items.forEach((item) => {
      selection[item[this.compareField]] = true;
    });
    this.selection.next(selection);
  }

  selectBatch(_items: Array<object>, selected: boolean) {
    _items.forEach((_item) => {
      const itemIndex = this.items.findIndex(
        (_iterator) => _iterator[this.compareField] === _item[this.compareField]
      );
      if (itemIndex >= 0 && !selected) {
        this.items.splice(itemIndex, 1);
      } else if (itemIndex < 0 && selected) {
        this.items.push(_item);
      }
    });

    const selection = {};
    this.items.forEach((item) => {
      selection[item[this.compareField]] = true;
    });
    this.selection.next(selection);
  }

  setCompareField(field: string) {
    this.compareField = field;
  }

  resetSelection() {
    this.items = [];
    this.selection.next({});
  }

  getSelectedCount() {
    return this.items.length;
  }

  getSelectedItems() {
    return this.items;
  }
}
