import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class QueryParameterCollectorService {

  private queryMap: Map<string, string>;

  constructor() {
  	this.queryMap = new Map<string, string>(); 
  }

  setParameter(key: string, value: string) {
  	this.queryMap.set(key, value);
  }

  getParameter(key: string): string {
  	return this.queryMap.get(key);
  }

  output(): void {
  	// console.log(this.queryMap);
  }
  
}
