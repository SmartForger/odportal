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

@Component({
  selector: "app-video-confirm",
  templateUrl: "./video-confirm.component.html",
  styleUrls: ["./video-confirm.component.scss"]
})
export class VideoConfirmComponent implements AfterViewInit, OnChanges {
  @Input() videoFiles: File[] = [];
  @Input() info: any = {};
  @Output() upload: EventEmitter<VideoModel>;
  @ViewChild("preview") preview: ElementRef<HTMLVideoElement>;

  uploading: boolean = false;

  constructor() {
    this.upload = new EventEmitter();
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
}
