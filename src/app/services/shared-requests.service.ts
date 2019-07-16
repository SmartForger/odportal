import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, Subscribable, forkJoin } from 'rxjs';
import { SharedRequest } from '../models/shared-request.model';
import { AuthService } from './auth.service';
import { Cloner } from '../util/cloner';

@Injectable({
  providedIn: 'root'
})
export class SharedRequestsService {
  private requests: Map<string, SharedRequest>;
  private appSubs: Map<string, BehaviorSubject<any>>;
  //private appsToRequests: Map<string, Array<string>>;
  
  constructor(private authSvc: AuthService, private http: HttpClient){
    this.requests = new Map<string, SharedRequest>();
    //this.appsToRequests = new Map<string, Array<string>>();
    this.appSubs = new Map<string, BehaviorSubject<any>>();
    this.fetchRequests().subscribe((requests: Array<SharedRequest>) => {
      for(let request of requests){
        this.requests.set(request.docId, request);
      }
    });
  }

  subToAppData(appId: string): Observable<any>{
    //If we already have a stream for the app, return it.
    if(this.appSubs.has(appId)){
      return this.appSubs.get(appId).asObservable();
    }
    else{
      //Find all request objects tied to the app.
      let appRequests = new Array<SharedRequest>();
      let requestArr = Array.from(this.requests.values());
      for(let request of requestArr){
        if(request.appIds.findIndex((id: string) => id === appId) !== -1){
          appRequests.push(request);
        }
      }

      //For each request the app needs, either we already have the data or we need to make the request.
      let appData = { };
      let requestsToMake = new Array<Subscribable<SharedRequest>>();
      let appRequestIds = new Array<string>();
      for(let request of appRequests){
        appRequestIds.push(request.docId);
        if(request.data){
          appData[request.name] = request.data;
        }
        else{
          requestsToMake.push(this.makeRequest(request));
        }
      }

      //If there are requests we need to make...
      if(requestsToMake.length > 0){
        //Create the behaviour subject.
        let sub = new BehaviorSubject<any>(null);
        this.appSubs.set(appId, sub);

        //Asynchronously make the requests, and push them through the subject when done.
        forkJoin(requestsToMake).subscribe((results) => {
          for(let result of results){
            appData[result.name] = result.data;
          }
          sub.next(appData);
        });

        //Return the subject now so the framework isn't waiting on those requests.
        return sub.asObservable();
      }
      //If all request data already exists, return synchronously.
      else{
        this.appSubs.set(appId, new BehaviorSubject<any>(appData));
        return this.appSubs.get(appId).asObservable();
      }
    }
  }

  getSharedRequests(): Array<SharedRequest>{
    return Cloner.cloneObjectArray(Array.from(this.requests.values()));
  }

  createSharedRequest(request: SharedRequest): Observable<SharedRequest>{
    return new Observable((observer) => {
      this.http.post<SharedRequest>(
        this.baseUri(),
        request,
        {
          headers: this.authSvc.getAuthorizationHeader()
        }
      ).subscribe(
        (result: SharedRequest) => {
          this.requests.set(result.docId, result);
          observer.next(result);
          observer.complete();
        },
        (err) => {
          console.log(err);
          observer.next(null);
          observer.complete();
        }
      );
    });
  }

  updateSharedRequest(request: SharedRequest): Observable<SharedRequest>{
    return new Observable((observer) => {
      this.http.patch<SharedRequest>(
        this.baseUri(),
        request,
        {
          headers: this.authSvc.getAuthorizationHeader()
        }
      ).subscribe(
        (result: SharedRequest) => {
          this.requests.set(result.docId, result);
          observer.next(result);
          observer.complete();
        },
        (err) => {
          console.log(err);
          observer.next(null);
          observer.complete();
        }
      )
    });
  }

  deleteSharedRequest(requestId: string): Observable<void>{
    return new Observable((observer) => {
      this.http.delete<void>(
        `${this.baseUri()}/id/${requestId}`,
        {
          headers: this.authSvc.getAuthorizationHeader()
        }
      ).subscribe(
        () => {
          let request = this.requests.get(requestId);
          for(let appId of request.appIds){
            if(this.appSubs.has(appId)){
              let data = this.appSubs.get(appId).getValue();
              delete data[request.name];
              if(Object.keys(data).length === 0){
                this.appSubs.get(appId).complete();
                this.appSubs.delete(appId);
              }
            }
          }
          this.requests.delete(requestId);
          observer.next(null);
          observer.complete();
        },
        (err) => {
          console.log(err);
          observer.next(null);
          observer.complete();
        }
      );
    });
  }

  private fetchRequests(): Observable<Array<SharedRequest>>{
    return this.http.get<Array<SharedRequest>>(
      this.baseUri(),
      {
        headers: this.authSvc.getAuthorizationHeader()
      }
    );
  }

  private makeRequest(request: SharedRequest): Observable<SharedRequest>{
    return new Observable((observer) => {
      console.log('sending shared request');
      console.log(request);
      let xhr = new XMLHttpRequest();
      xhr.open(request.method, request.endpoint);
      if(request.headers){
        for(let header of request.headers){
          xhr.setRequestHeader(header.display, header.value);
        }
      }
      xhr.onload = () => {
        console.log('shared request complete');
        console.log(xhr.response);
        this.poll(request.docId, true);
        observer.next(xhr.response);
        observer.complete();
      }
      xhr.send();
    });
  }

  private poll(requestId: string, delay: boolean = false): void{
    if(!this.requests.has(requestId)){
      return;
    }
    let request = this.requests.get(requestId);

    if(!request.enablePolling){
      return;
    }

    let openSubs = false;
    let appIndex = 0;
    while(!openSubs && appIndex < request.appIds.length){
      if(this.appSubs.has(request.appIds[appIndex]) && this.appSubs.get(request.appIds[appIndex]).observers.length > 0){
        openSubs = true;
      }
      appIndex++;
    }
    if(!openSubs){
      return;
    }

    if(delay){
      setTimeout(() => this.poll(requestId), request.polling);
      return;
    }
    
    this.makeRequest(request).subscribe((result) => {
      this.requests.get(request.docId).data = result.data;
      for(let appId of request.appIds){
        if(this.appSubs.has(appId)){
          let appData = this.appSubs.get(appId).getValue();
          appData[result.name] = result.data;
          this.appSubs.get(appId).next(appData);
        }
      }
      setTimeout(() => this.poll(request.docId), request.polling);
    });
  }

  private baseUri(): string{
    return `${this.authSvc.globalConfig.appsServiceConnection}api/v1/shared-requests/realm/${this.authSvc.globalConfig.realm}`;
  }

}
