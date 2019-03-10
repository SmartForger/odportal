import { Injectable } from '@angular/core';

let NativeXHR = {
  open: null,
  setRequestHeader: null,
  send: null
};

@Injectable({
  providedIn: 'root'
})
export class HttpRequestMonitorService {

  constructor() { 
    
  }

  start(): void {
    this.monitorOpen();
    this.monitorRequestHeaders();
    this.monitorSend();
  }

  private monitorOpen(): void {
    NativeXHR.open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function () {
      this.addEventListener('load', function () {
        console.log('request completed!');
        console.log(this.responseText);
      });
      NativeXHR.open.apply(this, arguments);
    };
  }

  private monitorRequestHeaders(): void {
    NativeXHR.setRequestHeader = XMLHttpRequest.prototype.setRequestHeader;
    XMLHttpRequest.prototype.setRequestHeader = function () {
      console.log("Header: " + arguments[0]);
      console.log("Value: " + arguments[1]);
      NativeXHR.setRequestHeader.apply(this, arguments);
    };
  }

  private monitorSend(): void {
    NativeXHR.send = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function () {
      console.log("request sent!");
      NativeXHR.send.apply(this, arguments);
      //this.abort();
    };
  }
}
