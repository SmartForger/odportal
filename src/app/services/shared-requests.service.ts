import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, Subscribable, forkJoin } from 'rxjs';
import { SharedRequest } from '../models/shared-request.model';
import { AuthService } from './auth.service';
import { Cloner } from '../util/cloner';
import { KeyValue } from '../models/key-value.model';

@Injectable({
  providedIn: 'root'
})
export class SharedRequestsService {
  private appSubs: Map<string, BehaviorSubject<any>>;
  private parameters: Array<KeyValue>;
  private postMessages: Map<string, any>;
  private requests: Map<string, SharedRequest>;

  constructor(private authSvc: AuthService, private http: HttpClient){
    this.appSubs = new Map<string, BehaviorSubject<any>>();
    this.parameters = new Array<KeyValue>();
    this.postMessages = new Map<string, any>();
    window.addEventListener("message", (event) => this.storeWPM(event), false);
  }


  getSharedRequests(): Observable<Array<SharedRequest>>{
    return new Observable((observer) => {
      if(this.requests){
        console.log(this.parameters);
        observer.next(Cloner.cloneObjectArray(Array.from(this.requests.values())));
        observer.complete();
      }
      else{
        this.http.get<Array<SharedRequest>>(
          this.baseUri(),
          {
            headers: this.authSvc.getAuthorizationHeader()
          }
        ).subscribe((requests: Array<SharedRequest>) => {
          this.requests = new Map<string, SharedRequest>();
          for(let request of requests){
            this.requests.set(request.docId, request);
            if(request.requestType === 'wpm' && this.postMessages.has(request.wpmType)){
                this.requests.get(request.docId).data = this.postMessages.get(request.wpmType);
            }
          }
          console.log(this.parameters);
          observer.next(Cloner.cloneObjectArray(Array.from(this.requests.values())));
          observer.complete();
        });
      }
    }) 
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

  subToAppData(appId: string): Observable<any>{
    //If we already have a stream for the app, return it.
    if(this.appSubs.has(appId)){
      return this.appSubs.get(appId).asObservable();
    }
    else{
      this.appSubs.set(appId, new BehaviorSubject<any>(null));
      if(!this.requests){
        this.getSharedRequests().subscribe((request: Array<SharedRequest>) => {
          this.buildAppData(appId);
        });
      }
      else{
        this.buildAppData(appId);
      }

      console.log(`subbing to app data for ${appId}`);
      this.appSubs.get(appId).asObservable().subscribe((value: any) => {console.log(`value for ${appId}`); console.log(value);});

      return this.appSubs.get(appId).asObservable();
    }
  }

  storeQueryParameter(name: string, value: any){
      console.log(`storing ${name} with value ${value}`);
      this.parameters.push({display: name, value: value});
  }

  getEventIdParameter(): string{
    let param = this.parameters.find((value: KeyValue) => {return value.display === 'wardenEventKey';});
    if(param !== undefined){
      return param.value;
    }
    else{
      return null;
    }
  }

  private buildAppData(appId: string): void{
    console.log(`building app data for ${appId}`);
    console.log(this.requests);
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
    for(let request of appRequests){
      if(request.data){
        appData[request.name] = request.data;
        if(request.requestType === 'rest'){this.poll(request.docId, true);}
      }
      else if(request.requestType === 'param'){
        console.log('Request is Param');
        console.log(request);
        let param: KeyValue = this.parameters.find((kv: KeyValue) => {return kv.display === request.parameter;});
        if(param !== undefined){
            console.log(param);
            request.data = param.value;
        }
        else{console.log('param is undefined');}
      }
      else if(request.requestType === 'rest'){
        requestsToMake.push(this.makeRequest(request));
      }
      else if(request.requestType === 'wpm' && this.postMessages.has(request.wpmType)){
        request.data = this.postMessages.get(request.wpmType);
      }
    }

    //If there are requests we need to make...
    if(requestsToMake.length > 0){
      //Asynchronously make the necessary requests, and push data through the subject when done.
      forkJoin(requestsToMake).subscribe((results) => {
        for(let result of results){
          appData[result.name] = JSON.parse(result.data);
          this.poll(result.docId, true);
        }
        this.appSubs.get(appId).next(appData);
      });
    }
    //If all request data already exists, return synchronously.
    else{
      this.appSubs.get(appId).next(appData);
    }
  }

  private makeRequest(request: SharedRequest): Observable<SharedRequest>{
    return new Observable((observer) => {
      let xhr = new XMLHttpRequest();
      xhr.open(request.method, request.endpoint);
      if(request.headers){
        for(let header of request.headers){
          xhr.setRequestHeader(header.display, header.value);
        }
      }
      xhr.onload = () => {
        request.data = xhr.response;
        observer.next(request);
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

    if(delay){
      setTimeout(() => this.poll(requestId), request.polling);
      return;
    }

    let openSubs = false;
    let appIndex = 0;
    while(!openSubs && appIndex < request.appIds.length){
      if(this.appSubs.has(request.appIds[appIndex]) && this.appSubs.get(request.appIds[appIndex]).observers.length > 0){
        openSubs = true;
      }
      else{
        this.appSubs.delete(request.appIds[appIndex]);
      }
      appIndex++;
    }
    if(!openSubs){
      return;
    }
    
    this.makeRequest(request).subscribe((result) => {
      this.requests.get(request.docId).data = result.data;
      for(let appId of request.appIds){
        if(this.appSubs.has(appId)){
          let appData = this.appSubs.get(appId).getValue();
          appData[result.name] = JSON.parse(result.data);
          this.appSubs.get(appId).next(appData);
        }
      }
      setTimeout(() => this.poll(request.docId), request.polling);
    });
  }

  private storeWPM(event: MessageEvent): void{
    if(event.data !== "unchanged"){
        console.log("SRS Event Received");
        console.log(event);
    }
    if(!event.data.hasOwnProperty('type')){

    }
    else{
        this.postMessages.set(event.data.type, event.data);
        if(this.requests){
            Array.from(this.requests.values()).forEach((request: SharedRequest) => {
                if(request.requestType === 'wpm' && request.hasOwnProperty('wpmType') && request.wpmType === event.data.type){
                    if(!request.data){request.data = { };}
                    request.data = event.data;
                    console.log('request.data: ');
                    console.log(request.data);
                    console.log('request appIds');
                    console.log(request.appIds);
                    request.appIds.forEach((appId: string) => {
                        if(this.appSubs.has(appId)){
                            this.buildAppData(appId);
                        }
                    });
                }
            });
        }
    }
  }

  private baseUri(): string{
    return `${this.authSvc.globalConfig.appsServiceConnection}api/v1/shared-requests/realm/${this.authSvc.globalConfig.realm}`;
  }

}
