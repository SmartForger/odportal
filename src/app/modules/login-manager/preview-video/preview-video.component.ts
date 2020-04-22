import { Component, OnInit, Input, Inject, ElementRef, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PlatformModalType } from 'src/app/models/platform-modal.model';
import { VideoModel } from 'src/app/models/video.model';
import { VideoService } from 'src/app/services/video.service';

@Component({
  selector: 'app-preview-video',
  templateUrl: './preview-video.component.html',
  styleUrls: ['./preview-video.component.scss']
})
export class PreviewVideoComponent implements OnInit {
  @ViewChild('videoEl') videoEl: ElementRef<any>;

  constructor(
    private dlgRef: MatDialogRef<PreviewVideoComponent>,
    private videoSvc: VideoService,
    @Inject(MAT_DIALOG_DATA) public video: VideoModel
  ) {
    this.dlgRef.addPanelClass("platform-modal");
    this.dlgRef.addPanelClass("max-w800");
    this.dlgRef.addPanelClass(PlatformModalType.PRIMARY);
  }

  ngOnInit() {
  }

  get videoSrc() {
    return `${this.videoSvc.getUploadPath()}/${this.video.filename}`;
  }

  edit() {
    this.dlgRef.close('edit');
  }

  fullscreen() {
    const elem = this.videoEl.nativeElement;

    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { 
      elem.msRequestFullscreen();
    }
  }
}
