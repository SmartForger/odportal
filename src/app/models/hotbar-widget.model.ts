import { App } from "./app.model";
import { Widget } from "./widget.model";

export interface HotbarWidget {
  appId?: string;
  widgetId?: string;
  app?: App;
  widget?: Widget;
  iconType: string;
  icon: string;
}