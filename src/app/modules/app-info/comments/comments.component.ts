import { Component, OnInit, OnDestroy, Input, ViewChild, ElementRef } from '@angular/core';
import {AppsService} from '../../../services/apps.service';
import {AppComment} from '../../../models/app-comment.model';
import {AppPermissionsBroker} from '../../../util/app-permissions-broker';
import {Subscription} from 'rxjs';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit, OnDestroy {

  @Input() vendorId: string;
  @Input() appId: string;
  @Input() isVendor: boolean;

  comments: Array<AppComment>;
  message: string;
  isInitialLoad: boolean;
  deploymentBroker: AppPermissionsBroker;
  managerBroker: AppPermissionsBroker;
  canCreate: boolean;
  private sessionUpdateSub: Subscription;

  @ViewChild('chatHistory') chatHistoryEl: ElementRef;

  private pollingInterval: any;

  constructor(private appsSvc: AppsService, private authSvc: AuthService) { 
    this.comments = new Array<AppComment>();
    this.message = "";
    this.isInitialLoad = true;
    this.deploymentBroker = new AppPermissionsBroker("micro-app-deployment");
    this.managerBroker = new AppPermissionsBroker("micro-app-manager");
    this.canCreate = false;
    this.isVendor = false;
  }

  ngOnInit() {
    this.setPermissions();
    this.subscribeToSessionUpdate();
    this.listComments();
    this.setPollingInterval();
  }

  ngOnDestroy() {
    this.sessionUpdateSub.unsubscribe();
    clearInterval(this.pollingInterval);
  }

  postComment(): void {
    if (this.message.trim().length) {
      const comment: AppComment = {
        isFromVendor: this.isVendor,
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

  private subscribeToSessionUpdate(): void {
    this.sessionUpdateSub = this.authSvc.sessionUpdatedSubject.subscribe(
      (userId: string) => {
        if (userId === this.authSvc.getUserId()) {
          this.setPermissions();
        }
      }
    );
  }

  private setPermissions(): void {
    this.canCreate = (this.deploymentBroker.hasPermission("Create") || this.managerBroker.hasPermission("Create"));
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
