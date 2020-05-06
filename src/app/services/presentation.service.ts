import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';

declare var PresentationRequest;
declare var navigator;

@Injectable({
  providedIn: 'root'
})
export class PresentationService {
  displayMap: any = {};
  isReceiver: boolean = false;
  onDashboardChange: BehaviorSubject<number>;

  constructor(private authSvc: AuthService) {
    this.onDashboardChange = new BehaviorSubject<number>(-1);
  }

  async openExternalDisplay(dashboardId: number) {
    const stateParams = this.authSvc.getStateParameters();
    const presentationRequest = new PresentationRequest(`${location.protocol}//${location.host}/portal/dashboard?token=${stateParams.token}&refreshToken=${stateParams.refreshToken}&idToken=${stateParams.idToken}`);

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

  checkReceiver() {
    if (!navigator.presentation.receiver) {
      return;
    }

    this.isReceiver = true;
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
      this.onDashboardChange.next(event.data);
    });
  }
}