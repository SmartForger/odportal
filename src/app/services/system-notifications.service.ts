import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SystemNotification, ReadReceipt} from '../models/system-notification.model';
import io from 'socket.io-client';
import {AuthService} from './auth.service';
import {Subject, BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SystemNotificationsService {

  private socket: any;
  private slotAuth: BehaviorSubject<boolean>;
  private slotList: Subject<Array<SystemNotification>>;
  private slotNotification: Subject<SystemNotification>;

  constructor(private authSvc: AuthService, private http: HttpClient) { 
    this.socket = io(this.authSvc.globalConfig.notificationsServiceConnection);
    this.slotAuth = new BehaviorSubject<boolean>(false);
    this.slotList = new Subject<Array<SystemNotification>>();
    this.slotNotification = new Subject<SystemNotification>();
    this.setupIOListeners();
  }

  list(): void {
    this.socket.emit('list', this.authSvc.getAccessToken());
  }

  createReadReceipt(rr: ReadReceipt): Observable<ReadReceipt> {
    return this.http.post<ReadReceipt>(
      `${this.authSvc.globalConfig.notificationsServiceConnection}api/v1/read-receipts/realm/${this.authSvc.globalConfig.realm}`,
      rr,
      {
        headers: this.authSvc.getAuthorizationHeader()
      }
    );
  }

  observeAuth(): Observable<boolean> {
    return this.slotAuth.asObservable();
  }

  observeList(): Observable<Array<SystemNotification>> {
    return this.slotList.asObservable();
  }

  observeNotification(): Observable<SystemNotification> {
    return this.slotNotification.asObservable();
  }

  private setupIOListeners() {
    this.socket.on('connect', () => {
      console.log("connected to Notifications Service");
      this.socket.emit('auth', {realm: this.authSvc.globalConfig.realm, bearer: `Bearer ${this.authSvc.getAccessToken()}`});
    });

    this.socket.on('disconnect', () => {
      console.log("disconnected from Notifications Service");
    });

    this.socket.on('list', (notifications: Array<SystemNotification>) => {
      this.slotList.next(notifications);
    });

    this.socket.on('auth', (response: {success: boolean}) => {
      this.slotAuth.next(response.success);
    });

    this.socket.on('notification', (notification: SystemNotification) => {
      this.slotNotification.next(notification);
    });
  }
}
