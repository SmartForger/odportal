import { App } from './app.model';
import { Widget } from "./widget.model";
import { AverageRating } from "./feedback-widget.model";

export interface WidgetFeedbackWithModels{
    app: App;
    widget: Widget;
    averageRating: AverageRating;
}