import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
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
    let modalRef: MatDialogRef<WidgetModalComponent> = this.dialog.open(WidgetModalComponent, {

    });

    modalRef.componentInstance.close.subscribe(close => modalRef.close());
  }

}
