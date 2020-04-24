import { Component, OnInit, Input } from '@angular/core';
import { VideoService } from 'src/app/services/video.service';

@Component({
  selector: 'app-video-card',
  templateUrl: './video-card.component.html',
  styleUrls: ['./video-card.component.scss']
})
export class VideoCardComponent implements OnInit {
  @Input() video: any;

  constructor(private videoSvc: VideoService) { }

  ngOnInit() {
  }


  get thumbnailSrc() {
    return `${this.videoSvc.getUploadPath()}/${this.video.thumbnail}`;
  }
}
