import { Injectable } from '@angular/core';

let NativeXHR = {
  open: null,
  setRequestHeader: null,
  send: null,
  signatures: []
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

  addSignature(signature: string): void {
    NativeXHR.signatures.push(signature);
    console.log(NativeXHR.signatures);
  }

  private monitorOpen(): void {
    NativeXHR.open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function () {
      NativeXHR.open.apply(this, arguments);
    };
  }

  private monitorRequestHeaders(): void {
    NativeXHR.setRequestHeader = XMLHttpRequest.prototype.setRequestHeader;
    XMLHttpRequest.prototype.setRequestHeader = function () {
      if (arguments.length === 2 && arguments[0] === "od360-request-signature") {
        if (NativeXHR.signatures.includes(arguments[1])) {
          this["od360-request-signature"] = arguments[1];
        }
      }
      else {
        NativeXHR.setRequestHeader.apply(this, arguments);
      }
    };
  }

  private monitorSend(): void {
    NativeXHR.send = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function () {
      if (this["od360-request-signature"]) {
        const requestSig: string = this["od360-request-signature"];
        const index: number = NativeXHR.signatures.findIndex((sig: string) => sig === requestSig);
        if (index > -1) {
          NativeXHR.signatures.splice(index, 1);
          NativeXHR.send.apply(this, arguments);
        }
      }
    };
  }
}
