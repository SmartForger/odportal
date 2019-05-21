import { Component, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { FeedbackWidgetService } from '../../../services/feedback-widget.service';
import { NotificationService } from '../../../notifier/notification.service';
import { UserProfile } from 'src/app/models/user-profile.model';
import { WidgetFeedback } from 'src/app/models/feedback-widget.model';
import { AppWithWidget } from 'src/app/models/app-with-widget.model';
import { NotificationType } from 'src/app/notifier/notificiation.model';

@Component({
  selector: 'app-feedback-widget',
  templateUrl: './feedback-widget.component.html',
  styleUrls: ['./feedback-widget.component.scss']
})
export class FeedbackWidgetComponent {

  rating: number;
  comment: string;
  anonymous: boolean;
  widgetId: string;
  appId: string;

  @Output() close: EventEmitter<void>;

  @ViewChild('feedbackFilePicker') private filePicker: ElementRef;

  constructor(protected authSvc: AuthService, protected feedbackWidgetSvc: FeedbackWidgetService, protected notifySvc: NotificationService, appWithWidget: AppWithWidget) 
  { 
    this.widgetId = appWithWidget.widget.docId;
    this.appId = appWithWidget.app.docId;
  }

  closeClicked(): void {
    this.close.emit();
  }

  submit(): void{
    this.authSvc.getUserProfile().then((up: UserProfile) => {
      const feedback: WidgetFeedback = {
        user: up,
        rating: this.rating,
        comment: this.comment,
        anonymous: this.anonymous,
        widgetId: this.widgetId,
        parentAppId: this.appId
      };

      this.feedbackWidgetSvc.create(feedback, this.getSelectedFile()).subscribe(
        (response: WidgetFeedback) => {
          if(response){
            this.notifySvc.notify({
              message: "Your feedback was successfully submitted. Thanks!",
              type: NotificationType.Success
            });
            this.close.emit();
          }
          else{
            this.notifySvc.notify({
              message: "There was a problem while submitting your feedback",
              type: NotificationType.Error
            });
            this.close.emit();
          }
        }
      );
    });
  }

  private getSelectedFile(): File {
    return (this.filePicker.nativeElement.files.length ? this.filePicker.nativeElement.files[0] : null);
  }

}
