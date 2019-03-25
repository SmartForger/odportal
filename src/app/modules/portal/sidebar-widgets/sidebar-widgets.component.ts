import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { WidgetModalComponent } from '../widget-modal/widget-modal.component';

@Component({
  selector: 'app-sidebar-widgets',
  templateUrl: './sidebar-widgets.component.html',
  styleUrls: ['./sidebar-widgets.component.scss']
})
export class SidebarWidgetsComponent implements OnInit {

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
  }

  openWidgetModal(){
    let widgetModalRef = this.dialog.open(WidgetModalComponent, {
    });
  }

}
