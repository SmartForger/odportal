import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WidgetTrackerService {

  private widgetIds: Array<string>;

  constructor() { 
    this.widgetIds = new Array<string>();
  }

  add(widgetId: string): void {
    this.widgetIds.push(widgetId);
    console.log(this.widgetIds.length);
  }

  remove(widgetId: string): void {
    const index: number = this.widgetIds.findIndex((id: string) => id === widgetId);
    this.widgetIds.splice(index, 1);
    console.log(this.widgetIds.length);
  }

  exists(widgetId: string): boolean {
    return this.widgetIds.includes(widgetId);
  }
}
