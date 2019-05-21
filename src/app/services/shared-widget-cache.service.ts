import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedWidgetCacheService {

  private _cache: Map<string, BehaviorSubject<any>>;

  constructor() { 
    this._cache = new Map<string, BehaviorSubject<any>>();
  }

  subscribeToCache(id: string): Observable<any>{
    if(!this._cache.has(id)){
      this._cache.set(id, new BehaviorSubject<any>({ }));
    }
    return this._cache.get(id).asObservable();
  }

  writeToCache(id: string, value: any): void{
    if(this._cache.has(id)){
      this._cache.get(id).next(value);
    }
    else{
      this._cache.set(id, new BehaviorSubject<any>(value));
    }
  }

}
