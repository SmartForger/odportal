import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'ng-title-icon-block',
  templateUrl: './ng-title-icon-block.component.html',
  styleUrls: ['./ng-title-icon-block.component.scss']
})
export class NgTitleIconBlockComponent implements OnInit {
  @Input() title: string = "";
  @Input() icon: string = "";
  @Input() helpText: string = "";
  @Input() tooltipText: string = "";

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

  private readFile(file: File) {
    const reader = new FileReader();

    reader.onload = (e: any) => {
      this.imgData = e.target.result;
    }

    reader.readAsDataURL(file);
  }
}
