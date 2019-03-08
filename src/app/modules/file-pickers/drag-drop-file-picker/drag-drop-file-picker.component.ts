import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-drag-drop-file-picker',
  templateUrl: './drag-drop-file-picker.component.html',
  styleUrls: ['./drag-drop-file-picker.component.scss']
})
export class DragDropFilePickerComponent implements OnInit {

  activeFile: File;

  @ViewChild('fileUpload') fileUploadEl: ElementRef;

  @Input() title: string;
  @Input() description: string;
  @Input() accept: string;

  @Output() fileChosen: EventEmitter<File>;

  constructor() { 
    this.fileChosen = new EventEmitter<File>();
  }

  ngOnInit() {
  }

  handleDrop($event: any): boolean {
    $event.preventDefault();
    $event.stopPropagation();
    this.activeFile = null;
    if ($event.dataTransfer.files.length && $event.dataTransfer.files[0].type.includes(this.accept)) {
      this.activeFile = $event.dataTransfer.files[0];
      this.fileChosen.emit(this.activeFile);
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
      this.fileChosen.emit(this.activeFile);
    }
  }

  clear(): void {
    this.fileUploadEl.nativeElement.value = "";
    this.activeFile = null;
  }

}
