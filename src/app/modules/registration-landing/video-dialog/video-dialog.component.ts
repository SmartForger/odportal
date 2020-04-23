import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { VideoModel } from 'src/app/models/video.model';
import { VideoService } from 'src/app/services/video.service';

@Component({
  selector: 'app-video-dialog',
  templateUrl: './video-dialog.component.html',
  styleUrls: ['./video-dialog.component.scss']
})
export class VideoDialogComponent implements OnInit {

  constructor(
    private videoSvc: VideoService,
    private dlgRef: MatDialogRef<VideoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public video: VideoModel
  ) {
    this.dlgRef.addPanelClass('landing-video-dialog');
  }

  ngOnInit() {
  }

  get videoSrc() {
    return this.videoSvc.getUploadPath() + '/' + this.video.filename;
  }

  get videoLength() {
    let secs = Math.round(+this.video.length);
    const h = Math.floor(secs /3600);
    secs = secs % 3600;
    const m = Math.floor(secs / 60);
    secs = secs % 60;

    let result = '';
    if (h > 1) {
      result += `${h} hours `;
    } else if (h > 0) {
      result += `${h} hour `;
    }

    if (m > 1) {
      result += `${m} minutes `;
    } else if (m === 1) {
      result += `${m} minute `;
    }
    
    return result + `${secs} second` + (secs > 1 ? 's' : '');
  }
}
