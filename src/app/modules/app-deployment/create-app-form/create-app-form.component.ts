import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-create-app-form',
  templateUrl: './create-app-form.component.html',
  styleUrls: ['./create-app-form.component.scss']
})
export class CreateAppFormComponent implements OnInit {

  activeFile: File;

  private _uploadProgress: number;
  get uploadProgress(): number {
    return this._uploadProgress;
  }
  set uploadProgress(progress: number) {
    this._uploadProgress = progress;
  }

  private _errorMessage: string;
  get errorMessage(): string {
    return this._errorMessage;
  }
  set errorMessage(message: string) {
    this._errorMessage = message;
  }

  @ViewChild('fileUpload') fileUploadEl: ElementRef;

  @Output() fileChosen: EventEmitter<File>;

  constructor() { 
    this.fileChosen = new EventEmitter<File>();
  }

  ngOnInit() {
  }

  clear(): void {
    this.activeFile = null;
    this.fileUploadEl.nativeElement.value = "";
    this.uploadProgress = 0;
    this.errorMessage = null;
  }

  handleDrop($event: any): boolean {
    $event.preventDefault();
    $event.stopPropagation();
    this.activeFile = null;
    if ($event.dataTransfer.files.length && $event.dataTransfer.files[0].type === "application/zip") {
      this.activeFile = $event.dataTransfer.files[0];
    }
    return false;
  }

  handleDrag($event: any): boolean {
    $event.preventDefault();
    $event.stopPropagation();
    return false;
  }

  handleClick($event: any): void {
    this.fileUploadEl.nativeElement.click();
  }

  filePicked($event: any): void {
    this.activeFile = null;
    if (this.fileUploadEl.nativeElement.files.length) {
      this.activeFile = this.fileUploadEl.nativeElement.files[0];
    }
  }

  confirmFile(): void {
    if (this.activeFile) {
      this.fileChosen.emit(this.activeFile);
    }
  }

}
