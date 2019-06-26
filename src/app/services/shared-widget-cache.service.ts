import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedWidgetCacheService {

  private _cache: Map<string, BehaviorSubject<Object>>;

  constructor() { 
    this._cache = new Map<string, BehaviorSubject<Object>>();
  }

  subscribeToCache(id: string): Observable<Object>{
    if(!this._cache.has(id)){
      this._cache.set(id, new BehaviorSubject<Object>({ }));
    }
    return this._cache.get(id).asObservable();
  }

  readFromCache(id: string): Object {
    if (!this._cache.has(id)) {
      return this._cache.get(id).value;
    }
    return {};
  }

  writeToCache(id: string, value: Object): void{
    if(this._cache.has(id)){
      this._cache.get(id).next(value);
    }
    else{
      this._cache.set(id, new BehaviorSubject<any>(value));
    }
  }

}
