import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-standard-file-progress-bar',
  templateUrl: './standard-file-progress-bar.component.html',
  styleUrls: ['./standard-file-progress-bar.component.scss']
})
export class StandardFileProgressBarComponent implements OnInit {

  private _activeFile: File;
  @Input('activeFile')
  get activeFile(): File {
    return this._activeFile;
  }
  set activeFile(file: File) {
    this._activeFile = file;
  }

  private _uploadProgress: number;
  @Input('uploadProgress')
  get uploadProgress(): number {
    return this._uploadProgress;
  }
  set uploadProgress(progress: number) {
    this._uploadProgress = progress;
  }

  constructor() { }

  ngOnInit() {
  }

}
