import { Injectable } from '@angular/core';
import { from, iif } from 'rxjs';
import { switchMap } from 'rxjs/operators';

declare var PresentationRequest;

@Injectable({
  providedIn: 'root'
})
export class PresentationService {
  displayMap: any = {};

  constructor() { }

  async openExternalDisplay(dashboarId: string) {
    const presentationRequest = new PresentationRequest(`${location.protocol}//${location.host}/casting`);

    try {
      await presentationRequest.start();
      presentationRequest.addEventListener('connectionavailable', ev => {
        const connection = ev.connection;
        this.displayMap[connection.id] = {
          connection,
          dashboarId
        };

        connection.addEventListener('close', function() {
          delete this.displayMap[connection.id];
        });
        connection.addEventListener('terminate', function() {
          delete this.displayMap[connection.id];
        });

        this.sendDashboardId(connection, dashboarId);
      });
    } catch (err) {
      console.log('Error occured connecting to external display: ', err);
      alert('Cannot connect to external display');
    }

    return null;
  }

  sendDashboardId(connection, dashboarId, tries = 0) {
    if (connection.state === 'connected') {
      connection.send(dashboarId);
    } else if (tries < 5) {
      setTimeout(() => {
        this.sendDashboardId(connection, dashboarId, tries + 1);
      }, 500);
    }
  }
}
