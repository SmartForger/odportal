import { Component, OnInit, OnDestroy, Input, ViewChild, ElementRef } from '@angular/core';
import {AppsService} from '../../../services/apps.service';
import {AppComment} from '../../../models/app-comment.model';

@Component({
  selector: 'app-edit-app-comments',
  templateUrl: './edit-app-comments.component.html',
  styleUrls: ['./edit-app-comments.component.scss']
})
export class EditAppCommentsComponent implements OnInit, OnDestroy {

  @Input() vendorId: string;
  @Input() appId: string;

  comments: Array<AppComment>;
  message: string;
  isInitialLoad: boolean;

  @ViewChild('chatHistory') chatHistoryEl: ElementRef;

  private pollingInterval: any;

  constructor(private appsSvc: AppsService) { 
    this.comments = new Array<AppComment>();
    this.message = "";
    this.isInitialLoad = true;
  }

  ngOnInit() {
    this.listComments();
    this.setPollingInterval();
  }

  ngOnDestroy() {
    clearInterval(this.pollingInterval);
  }

  postComment(): void {
    if (this.message.trim().length) {
      const comment: AppComment = {
        isFromVendor: true,
        message: this.message
      };
      this.message = "";
      this.appsSvc.postComment(this.vendorId, this.appId, comment).subscribe(
        (comment: AppComment) => {
          this.comments.push(comment);
          this.scrollChatHistory();
        },
        (err: any) => {
          console.log(err);
        }
      );
    }
  }

  private scrollChatHistory(): void {
    setTimeout(() => {
      this.chatHistoryEl.nativeElement.scrollTop = this.chatHistoryEl.nativeElement.scrollHeight;
    });
  }

  private listComments(): void {
    this.appsSvc.fetchVendorAppComments(this.vendorId, this.appId).subscribe(
      (comments: Array<AppComment>) => {
        this.comments = comments;
        if (this.isInitialLoad) {
          this.scrollChatHistory();
          this.isInitialLoad = false;
        }
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  private setPollingInterval(): void {
    this.pollingInterval = setInterval(() => {
      this.listComments();
    }, 15000);
  }

}
