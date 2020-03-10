import { Component, EventEmitter, OnInit, Input, Output, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss']
})
export class ImageUploadComponent implements OnInit {
  @Input() fallback: string = "";
  @Input() selectLabel: string = "Select image";
  @Input() changeLabel: string = "Change image";
  @Input() width: number = 100;
  @Input() height: number = 100;

  private _file: File;
  get file() {
    return this._file;
  }
  @Input()
  set file(val: File) {
    if (val) {
      this._file = val;
      this.readFile(val);
    } else {
      this._file = null;
      this.imgData = "";
    }
  }

  @Output() fileChange: EventEmitter<File>;

  imgData: any;

  constructor() {
    this.fileChange = new EventEmitter<File>();
  }

  ngOnInit() {
  }

  fileChanged(ev) {
    if (ev.target.files && ev.target.files[0]) {
      this.fileChange.emit(ev.target.files[0]);
    }
  }

  get iconStyles() {
    return {
      height: this.height + 'px',
      lineHeight: this.height + 'px',
      fontSize: (this.height * 0.8) + 'px'
    };
  }

  get imgStyles() {
    return {
      height: this.height + 'px'
    };
  }

  private readFile(file: File) {
    const reader = new FileReader();

    reader.onload = (e: any) => {
      this.imgData = e.target.result;
    }

    reader.readAsDataURL(file);
  }
}