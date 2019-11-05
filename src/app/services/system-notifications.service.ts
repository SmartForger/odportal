import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SystemNotification, ReadReceipt, TotalNotifications} from '../models/system-notification.model';
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
    this.socket = io(this.authSvc.globalConfig.notificationsServiceConnection.replace('notifications-service/', ""), {path: '/notifications-service/socket.io'});
    this.slotAuth = new BehaviorSubject<boolean>(false);
    this.slotList = new Subject<Array<SystemNotification>>();
    this.slotNotification = new Subject<SystemNotification>();
    this.setupIOListeners();
  }

  list(): void {
    this.socket.emit('list', this.authSvc.getAccessToken());
  }

  getTotalNotifications(startDate: string, endDate: string): Observable<Array<TotalNotifications>> {
    return this.http.get<Array<TotalNotifications>>(
      `${this.generateNotificationsUrl()}/total/${startDate}/${endDate}`,
      {
        headers: this.authSvc.getAuthorizationHeader()
      }
    );
  }

  getTotalDailyNotifications(startDate: string, endDate: string): Observable<Array<TotalNotifications>> {
    return this.http.get<Array<TotalNotifications>>(
      `${this.generateNotificationsUrl()}/total/daily/${startDate}/${endDate}`,
      {
        headers: this.authSvc.getAuthorizationHeader()
      }
    );
  }

  createReadReceipt(rr: ReadReceipt): Observable<ReadReceipt> {
    return this.http.post<ReadReceipt>(
      this.generateReadReceiptUrl(),
      rr,
      {
        headers: this.authSvc.getAuthorizationHeader()
      }
    );
  }

  createReadReceiptsBulk(rrs: Array<ReadReceipt>): Observable<Array<ReadReceipt>> {
    return this.http.post<Array<ReadReceipt>>(
      `${this.generateReadReceiptUrl()}/bulk`,
      rrs,
      {
        headers: this.authSvc.getAuthorizationHeader()
      }
    );
  }

  createNotification(notification: SystemNotification): Observable<SystemNotification> {
    return this.http.post<SystemNotification>(
      this.generateNotificationsUrl(),
      notification,
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

    this.socket.on('disconnect', (reason: string) => {
      console.log("disconnected from Notifications Service");
      console.log(`reason: ${reason}`);
      if (reason === "io server disconnect") {
        this.socket.connect();
      }
    });

    this.socket.on('list', (notifications: Array<SystemNotification>) => {
      this.slotList.next(notifications);
    });

    this.socket.on('auth', (response: {success: boolean}) => {
      this.slotAuth.next(response.success);
    });

    this.socket.on('notification', (notification: SystemNotification) => {
      this.slotNotification.next(notification);
      this.playSound();
    });
  }

  private playSound() {
    var audio = new Audio();
    audio.src = '/assets/sounds/zapsplat_multimedia_alert_generic_mallet_wood_008_30076.mp3';
    audio.load();
    audio.play();
  }

  private generateReadReceiptUrl(): string {
    return `${this.authSvc.globalConfig.notificationsServiceConnection}api/v1/read-receipts/realm/${this.authSvc.globalConfig.realm}`;
  }

  private generateNotificationsUrl(): string {
    return `${this.authSvc.globalConfig.notificationsServiceConnection}api/v1/notifications/realm/${this.authSvc.globalConfig.realm}`;
  }
}
