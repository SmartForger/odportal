import { Component, OnInit, Input } from "@angular/core";
import { MatDialog, MatDialogRef } from '@angular/material';
import { orderBy } from 'lodash';

import { DirectQueryList } from "src/app/base-classes/direct-query-list";
import { VideoModel } from "src/app/models/video.model";
import { KeyValue } from "src/app/models/key-value.model";
import { VideoService } from "src/app/services/video.service";
import { NotificationService } from '../../../notifier/notification.service';
import { NotificationType } from '../../../notifier/notificiation.model';

import { UploadVideoComponent } from '../upload-video/upload-video.component';
import { PreviewVideoComponent } from '../preview-video/preview-video.component';
import { VideoEditDialogComponent } from '../video-edit-dialog/video-edit-dialog.component';

@Component({
  selector: "app-videos",
  templateUrl: "./videos.component.html",
  styleUrls: ["./videos.component.scss"]
})
export class VideosComponent extends DirectQueryList<VideoModel> implements OnInit {
  @Input() envID: string = '';

  menuOptions: Array<KeyValue>;
  search: string = '';
  filters: string[] = [];

  constructor(
    private dialog: MatDialog,
    private videoSvc: VideoService,
    private notificationSvc: NotificationService
  ) {
    super(
      new Array<string>(
        "name",
        "creatorName",
        "format",
        "length",
        "updatedAt",
        "status",
        "actions"
      )
    );
    this.query = function(first: number, max: number) {
      return this.videoSvc.getVideos();
    }.bind(this);
    this.menuOptions = [
      {
        value: "published",
        display: "Published"
      },
      {
        value: "draft",
        display: "Draft"
      }
    ];
  }

  ngOnInit() {
    super.ngOnInit();
  }

  uploadVideo() {
    let modalRef: MatDialogRef<UploadVideoComponent> = this.dialog.open(UploadVideoComponent);
    modalRef.afterClosed().subscribe((data: any) => {
      if (data) {
        this.videoSvc.uploadVideo({
          environment: this.envID,
          ...data
        }).subscribe(
          (video: VideoModel) => {
            this.items.push(video);
            this.sort.sortChange.next();

            this.notificationSvc.notify({
              type: NotificationType.Success,
              message: "A support video was uploaded successfully."
            });
          },
          () => {
            this.notificationSvc.notify({
              type: NotificationType.Error,
              message: "Uploading a support video failed."
            });
          }
        )
      }
    });
  }

  previewVideo(video: VideoModel) {
    let modalRef: MatDialogRef<PreviewVideoComponent> = this.dialog.open(PreviewVideoComponent, {
      data: video
    });
    modalRef.afterClosed().subscribe((data: any) => {
      if (data === 'edit') {
        this.editVideo(video);
      }
    });
  }

  editVideo(video: VideoModel) {
    let modalRef: MatDialogRef<VideoEditDialogComponent> = this.dialog.open(VideoEditDialogComponent, {
      data: video
    });
    modalRef.afterClosed().subscribe((data: any) => {
      if (data === 'preview') {
        this.previewVideo(video);
      } else if (data && data.docId) {
        this.items = this.items.map(item => item.docId === data.docId ? data : item);
        this.filterItems();
        this.listDisplayItems();
      }
    });
  }

  publishVideo(video: VideoModel) {
    this.videoSvc.updateVideo({
      docId: video.docId,
      status: 'published'
    }).subscribe(
      (v: VideoModel) => {
        this.items = this.items.map(item => item.docId === v.docId ? v : item);
        this.filterItems();
        this.listDisplayItems();
      }
    );
  }

  unpublishVideo(video: VideoModel) {
    this.videoSvc.updateVideo({
      docId: video.docId,
      status: 'draft'
    }).subscribe(
      (v: VideoModel) => {
        this.items = this.items.map(item => item.docId === v.docId ? v : item);
        this.filterItems();
        this.listDisplayItems();
      }
    );
  }

  deleteVideo(video: VideoModel) {
    this.videoSvc.deleteVideo(video.docId).subscribe(() => {
      this.items = this.items.filter(item => item.docId !== video.docId);
      this.filterItems();
      this.listDisplayItems();
    });
  }

  changeFilters(filters) {
    this.filters = filters;
    this.filterItems();
    this.listDisplayItems();
  }

  updateSearch(search) {
    this.search = search.toLowerCase();
    this.filterItems();
    this.listDisplayItems();
  }

  formatLength(secs) {
    secs = Math.round(secs);
    const h = Math.floor(secs /3600);
    secs = secs % 3600;
    const m = Math.floor(secs / 60);
    secs = secs % 60;

    let result = '';
    if (h > 0) {
      result += `${h}h `;
    }
    if (h > 0 || m > 0) {
      result += `${m}m `;
    }
    
    return result + `${secs}s`;
  }

  protected filterItems(): void {
    const filtered = this.items.filter(
      (item: VideoModel) =>
        (this.filters.length === 0 || this.filters.indexOf(item.status) >= 0)
        && item.name.toLowerCase().indexOf(this.search) >= 0
    );
    this.filteredItems = orderBy(filtered, [this.sortColumn], [this.sortOrder]);
  }
}
