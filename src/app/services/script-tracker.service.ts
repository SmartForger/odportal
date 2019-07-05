import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScriptTrackerService {

  private loadMap: Map<string, boolean>;
  private loadSubs: Map<string, Subject<void>>;

  constructor() { 
    this.loadMap = new Map<string, boolean>();
    this.loadSubs = new Map<string, Subject<void>>();
  }

  exists(src: string): boolean{
    return this.loadMap.has(src);
  }

  loaded(src: string): boolean{
    return this.loadMap.has(src) && this.loadMap.get(src);
  }

  setScriptStatus(src: string, loaded: boolean): void{
    this.loadMap.set(src, loaded);
    
    if(loaded && this.loadSubs.has(src)){
      this.loadSubs.get(src).next(null);
      this.loadSubs.get(src).complete();
      this.loadSubs.delete(src);
    }
  }

  subscribeToLoad(src: string): Observable<void>{
    if(!this.loadMap.has(src)){
      this.loadMap.set(src, false);
    }
    else if(this.loadMap.get(src)){
      return new Observable<void>((observer) => {
        observer.next(null);
        observer.complete();
      });
    }

    if(!this.loadSubs.has(src)){
      this.loadSubs.set(src, new Subject<void>());
    }
    
    return this.loadSubs.get(src).asObservable();
  }
}
