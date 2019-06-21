import { Component, OnInit, ElementRef, ViewChild, Input } from '@angular/core';
import { CustomFormElement } from '../custom-form-element';

@Component({
  selector: 'app-file-input',
  templateUrl: './file-input.component.html',
  styleUrls: ['./file-input.component.scss']
})
export class FileInputComponent extends CustomFormElement implements OnInit {
  @Input() buttonText: string = 'Choose File';
  @ViewChild('file') fileInput: ElementRef<HTMLInputElement>;

  selectedFiles: FileList = null;
  selectedFilesInfo: any[] = [];

  constructor() {
    super();
  }

  ngOnInit() {}

  openFileDialog() {
    this.fileInput.nativeElement.click();
  }

  handleChange(ev) {
    console.log(ev);
    this.selectedFiles = ev.target.files;
    this.selectedFilesInfo = [];
    for(let i = 0; i < this.selectedFiles.length; i ++) {
      const file = this.selectedFiles.item(i);
      this.selectedFilesInfo.push({
        name: file.name,
        size: Math.round(file.size / 1024)
      });
    }
  }
}
