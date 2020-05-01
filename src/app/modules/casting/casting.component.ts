import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';

declare var navigator: any;

@Component({
  selector: 'app-casting',
  templateUrl: './casting.component.html',
  styleUrls: ['./casting.component.scss']
})
export class CastingComponent implements AfterViewInit {
  @ViewChild('iframe') iframe: ElementRef<HTMLIFrameElement>;

  constructor() { }

  ngAfterViewInit() {
    navigator.presentation.receiver.connectionList
      .then(list => {
        list.connections.map(connection => this.addConnection(connection));
        list.addEventListener('connectionavailable', function (event) {
          this.addConnection(event.connection);
        });
      });
  }

  private addConnection(connection: any) {
    connection.send('requestDashboard');
    connection.addEventListener('message', event => {
      this.iframe.nativeElement.src = `${location.protocol}//${location.host}?forcelogin=1&dashboardId=${event.data}`;
    });
  }
}
