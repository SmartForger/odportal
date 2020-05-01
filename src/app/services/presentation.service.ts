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

  async openExternalDisplay(dashboardId: string) {
    const presentationRequest = new PresentationRequest(`${location.protocol}//${location.host}/casting`);

    try {
      await presentationRequest.start();
      presentationRequest.addEventListener('connectionavailable', ev => {
        const connection = ev.connection;
        this.displayMap[connection.id] = {
          connection,
          dashboardId
        };

        connection.addEventListener('close', () => {
          delete this.displayMap[connection.id];
        });
        connection.addEventListener('terminate', () => {
          delete this.displayMap[connection.id];
        });
        connection.addEventListener('message', () => {
          connection.send(this.displayMap[connection.id].dashboardId);
        });
      });
    } catch (err) {
      console.log('Error occured connecting to external display: ', err);
      alert('Cannot connect to external display');
    }

    return null;
  }
}
