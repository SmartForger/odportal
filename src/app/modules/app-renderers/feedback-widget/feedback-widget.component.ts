import { Component, Output, EventEmitter, ViewChild, ElementRef, Input, Inject } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { FeedbackWidgetService } from '../../../services/feedback-widget.service';
import { NotificationService } from '../../../notifier/notification.service';
import { UserProfile } from 'src/app/models/user-profile.model';
import { WidgetFeedback } from 'src/app/models/feedback-widget.model';
import { NotificationType } from 'src/app/notifier/notificiation.model';
import { Widget } from 'src/app/models/widget.model';
import { App } from 'src/app/models/app.model';
import {MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-feedback-widget',
  templateUrl: './feedback-widget.component.html',
  styleUrls: ['./feedback-widget.component.scss']
})
export class FeedbackWidgetComponent {

  rating: number;
  comment: string;
  anonymous: boolean;
  
  @Input() widgetId: string;
  @Input() appId: string;

  @Output() close: EventEmitter<void>;

  @ViewChild('feedbackFilePicker') private filePicker: ElementRef;

  constructor(
    private authSvc: AuthService, 
    private feedbackWidgetSvc: FeedbackWidgetService, 
    private notifySvc: NotificationService,
    @Inject(MAT_DIALOG_DATA) private data: any) 
  { 
    this.rating = 3;
    this.comment = '';
    this.anonymous = false;
    this.widgetId = data.widgetId;
    this.appId = data.appId;
    this.close = new EventEmitter<void>();
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
