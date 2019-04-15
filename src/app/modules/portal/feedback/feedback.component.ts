import { Component, OnInit, OnDestroy, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import {Feedback} from '../../../models/feedback.model';
import {AuthService} from '../../../services/auth.service';
import {UserProfile} from '../../../models/user-profile.model';
import {Router} from '@angular/router';
import {FeedbackService} from '../../../services/feedback.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit, OnDestroy {

  rating: number;
  comment: string;
  anonymous: boolean;
  private routeChangeSub: Subscription;

  @Output() close: EventEmitter<void>;

  @ViewChild('feedbackFilePicker') private filePicker: ElementRef;

  constructor(
    private router: Router,
    private authSvc: AuthService,
    private feedbackSvc: FeedbackService) { 
      this.rating = 3;
      this.comment = "";
      this.anonymous = false;
      this.close = new EventEmitter<void>();
  }

  ngOnInit() {
    this.subscribeToRouteChange();
  }

  ngOnDestroy() {
    this.routeChangeSub.unsubscribe();
  }

  closeClicked(): void {
    this.close.emit();
  }

  private subscribeToRouteChange(): void {
    this.routeChangeSub = this.feedbackSvc.observeRouteChanged().subscribe(() => {
      this.close.emit();
    });
  }

  submit(): void {
    this.authSvc.getUserProfile().then((up: UserProfile) => {
      const strippedUrl: string = this.router.url.replace(/#.*/g, '');
      const feedback: Feedback = {
        user: up,
        rating: this.rating,
        comment: this.comment,
        anonymous: this.anonymous,
        url: strippedUrl,
        pageGroup: this.stripParams(strippedUrl)
      };
    });
  }

  private stripParams(url: string): string {
    this.feedbackSvc.routerParams.forEach((param: string) => {
      const regex = new RegExp(`${param}`, 'g');
      url = url.replace(regex, '');
    });
    url = url.replace(/(\/\/)/g, '');
    return url;
  }

}
