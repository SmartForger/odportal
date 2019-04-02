/**
 * @description Monitors all outgoing AJAX requests and sends/aborts them based on signature validity
 * @author Steven M. Redman
 * 
 */

import { Injectable } from '@angular/core';
import {HttpSignatureKey} from '../util/constants';
import * as uuid from 'uuid';

let NativeXHR = {
  open: null,
  setRequestHeader: null,
  send: null,
  signatures: [],
  whitelist: [
    {
      path: '/auth/realms/my-realm/account',
      verb: 'get'
    },
    {
      path: '/auth/realms/my-realm/protocol/openid-connect/token',
      verb: 'post'
    }
  ]
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

  stop(): void {
    XMLHttpRequest.prototype.open = NativeXHR.open;
    XMLHttpRequest.prototype.setRequestHeader = NativeXHR.setRequestHeader;
    XMLHttpRequest.prototype.send = NativeXHR.send;
    NativeXHR.signatures = [];
  }

  addSignature(signature: string): void {
    NativeXHR.signatures.push(signature);
  }

  private monitorOpen(): void {
    NativeXHR.open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function () {
      const args = arguments;
      const whitelist: any = NativeXHR.whitelist.find((item: any) => {
        return (args[1].toLowerCase().includes(item.path) && item.verb === args[0].toLowerCase());
      }); 
      if (whitelist) {
        const sig: string = uuid.v4();
        NativeXHR.signatures.push(sig);
        this[HttpSignatureKey] = sig;
      }
      NativeXHR.open.apply(this, arguments);
    };
  }

  private monitorRequestHeaders(): void {
    NativeXHR.setRequestHeader = XMLHttpRequest.prototype.setRequestHeader;
    XMLHttpRequest.prototype.setRequestHeader = function () {
      if (arguments.length === 2 && arguments[0] === HttpSignatureKey) {
        if (NativeXHR.signatures.includes(arguments[1])) {
          this[HttpSignatureKey] = arguments[1];
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
      if (this[HttpSignatureKey]) {
        const requestSig: string = this[HttpSignatureKey];
        const index: number = NativeXHR.signatures.findIndex((sig: string) => sig === requestSig);
        if (index > -1) {
          NativeXHR.signatures.splice(index, 1);
          NativeXHR.send.apply(this, arguments);
        }
        else {
          this.abort();
        }
      }
      else {
        this.abort();
      }
    };
  }
}
