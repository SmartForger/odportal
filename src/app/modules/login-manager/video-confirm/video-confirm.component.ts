import {
  Component,
  AfterViewInit,
  EventEmitter,
  Input,
  ViewChild,
  ElementRef,
  OnChanges,
  Output,
  SimpleChanges
} from "@angular/core";
import { VideoModel } from 'src/app/models/video.model';
import { VideoService } from 'src/app/services/video.service';

@Component({
  selector: "app-video-confirm",
  templateUrl: "./video-confirm.component.html",
  styleUrls: ["./video-confirm.component.scss"]
})
export class VideoConfirmComponent implements AfterViewInit, OnChanges {
  @Input() videoFiles: File[] = [];
  @Input() info: any = {};
  @Output() uploaded: EventEmitter<VideoModel>;
  @ViewChild("preview") preview: ElementRef<HTMLVideoElement>;

  uploading: boolean = false;

  constructor(private videoSvc: VideoService) {
    this.uploaded = new EventEmitter();
  }

  ngAfterViewInit() {
    this.changePreview();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.videoFiles && changes.videoFiles.currentValue) {
      this.videoFiles = changes.videoFiles.currentValue;
      this.changePreview();
    }
  }

  changePreview() {
    if (this.preview && this.preview.nativeElement) {
      if (this.videoFiles && this.videoFiles[0]) {
        let blobURL = URL.createObjectURL(this.videoFiles[0]);
        this.preview.nativeElement.src = blobURL;
      } else {
        this.preview.nativeElement.src = "";
      }
    }
  }

  upload() {
    this.uploading = true;
    this.videoSvc.uploadVideo({
      name: this.info.name,
      description: this.info.description,
      keywords: this.info.keywords.join(','),
      video: this.videoFiles[0]
    }).subscribe(
      (video: VideoModel) => {
        this.uploading = false;
        this.uploaded.emit(video);
      },
      () => {
        this.uploading = false;
        this.uploaded.emit();
      }
    );
  }
}
