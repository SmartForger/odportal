import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { sortBy } from 'lodash';
import { AuthService } from './auth.service';
import { PresentationMonitor } from '../models/presentation-monitor';

declare var PresentationRequest;
declare var navigator;

@Injectable({
  providedIn: 'root'
})
export class PresentationService {
  displayMap: {
    [key: string]: PresentationMonitor
  } = {};
  isReceiver: boolean = false;
  onDashboardChange: BehaviorSubject<number>;
  onMonitorAdded: Subject<PresentationMonitor>;
  onMonitorRemoved: Subject<PresentationMonitor>;
  onMonitorUpdated: Subject<PresentationMonitor>;
  lastIndex = 0;
  hasExternalMonitor = false;

  constructor(private authSvc: AuthService) {
    this.onDashboardChange = new BehaviorSubject<number>(-1);
    this.onMonitorAdded = new Subject<PresentationMonitor>();
    this.onMonitorRemoved = new Subject<PresentationMonitor>();
    this.onMonitorUpdated = new Subject<PresentationMonitor>();
  }

  async openExternalDisplay(dashboardId: number) {
    const stateParams = this.authSvc.getStateParameters();
    const presentationRequest = new PresentationRequest(`${location.protocol}//${location.host}/portal/dashboard?token=${stateParams.token}&refreshToken=${stateParams.refreshToken}&idToken=${stateParams.idToken}`);

    try {
      await presentationRequest.start();
      presentationRequest.addEventListener('connectionavailable', ev => {
        const connection = ev.connection;

        this.lastIndex++;
        this.displayMap[connection.id] = {
          connection,
          dashboardId,
          id: connection.id,
          index: this.lastIndex,
          name: `Monitor ${this.lastIndex}`
        };

        connection.addEventListener('close', () => {
          this.onMonitorRemoved.next(this.displayMap[connection.id]);
          delete this.displayMap[connection.id];
        });
        connection.addEventListener('terminate', () => {
          this.onMonitorRemoved.next(this.displayMap[connection.id]);
          delete this.displayMap[connection.id];
        });
        connection.addEventListener('message', () => {
          connection.send(this.displayMap[connection.id].dashboardId);
        });

        this.onMonitorAdded.next(this.displayMap[connection.id]);
      });

      await this.checkAvailability();
    } catch (err) {
      console.log('Error occured connecting to external display: ', err);
      alert('Cannot connect to external display');
    }

    return null;
  }

  changeDashboard(dashboardId, connectionId) {
    const monitor = this.displayMap[connectionId] as PresentationMonitor;
    if (monitor && monitor.connection) {
      monitor.dashboardId = dashboardId;
      monitor.connection.send(dashboardId);
      this.onMonitorUpdated.next(monitor);
    }
  }

  getConnectedMonitors() {
    const monitors = Object.values(this.displayMap);
    sortBy(monitors, ['index']);
    return monitors;
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

  public async checkAvailability() {
    const presentationRequest = new PresentationRequest("https://www.google.com");
    const availability = await presentationRequest.getAvailability();
    this.hasExternalMonitor = availability.value;
    return null;
  }
}
