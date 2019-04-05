/**
 * @description Displays information and upload progress a file selected from the drag-and-drop file picker.
 * @author Steven M. Redman
 */

import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import {DragDropFilePickerComponent} from '../../file-pickers/drag-drop-file-picker/drag-drop-file-picker.component';

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

  @ViewChild(DragDropFilePickerComponent) filePicker: DragDropFilePickerComponent;

  @Output() fileChosen: EventEmitter<File>;

  constructor() { 
    this.uploadProgress = 0;
    this.fileChosen = new EventEmitter<File>();
  }

  ngOnInit() {
  }

  clear(): void {
    this.activeFile = null;
    this.uploadProgress = 0;
    this.errorMessage = null;
    this.filePicker.clear();
  }
  
  filePicked(file: File): void {
    this.activeFile = file;
  }

  confirmFile(): void {
    if (this.activeFile) {
      this.fileChosen.emit(this.activeFile);
    }
  }

}
