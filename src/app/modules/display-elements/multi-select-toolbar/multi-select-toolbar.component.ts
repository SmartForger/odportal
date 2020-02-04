import { Component, OnInit } from '@angular/core';
import { TableSelectionService } from '../../../services/table-selection.service';

@Component({
  selector: 'app-multi-select-toolbar',
  templateUrl: './multi-select-toolbar.component.html',
  styleUrls: ['./multi-select-toolbar.component.scss']
})
export class MultiSelectToolbarComponent implements OnInit {
  count: number;

  constructor(private selectionSvc: TableSelectionService) {
    this.count = 0;
  }

  ngOnInit() {
    this.selectionSvc.selection.subscribe(() => {
      this.count = this.selectionSvc.getSelectedCount();
    });
  }

  reset() {
    this.selectionSvc.resetSelection();
  }

}
