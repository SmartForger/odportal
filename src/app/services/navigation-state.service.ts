import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavigationStateService {
  states: any;

  constructor() {
    this.states = {};
  }

  setState(key, state) {
    this.states[key] = state;
    console.log('nav state', this.states);
  }

  getState(key) {
    return this.states[key];
  }
}
