import { Component, OnInit } from '@angular/core';
import { WidgetModalService } from 'src/app/services/widget-modal.service';

@Component({
  selector: 'app-sidebar-widgets',
  templateUrl: './sidebar-widgets.component.html',
  styleUrls: ['./sidebar-widgets.component.scss']
})
export class SidebarWidgetsComponent implements OnInit {

  constructor(private widgetModalSvc: WidgetModalService) { }

  ngOnInit() {
  }
}
