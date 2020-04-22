import {
  Component,
  AfterViewInit,
  HostListener,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef
} from "@angular/core";
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: "app-video-upload",
  templateUrl: "./video-upload.component.html",
  styleUrls: ["./video-upload.component.scss"]
})
export class VideoUploadComponent implements AfterViewInit {
  @Input() multiple: boolean = false;
  @Input() form: FormGroup;

  get controlName() {
    return this._controlName;
  }
  @Input() set controlName(name: string) {
    this._controlName = name;
    if (this.form && name) {
      const control = this.form.get(name);

      if (control && control.value && control.value.length > 0) {
        this.files = control.value;
      }
    }
  }

  @Output() select: EventEmitter<File[]>;
  @ViewChild("fileInput") fileInput: ElementRef<HTMLInputElement>;

  dragover: boolean = false;
  files: File[] = [];
  _controlName: string = '';

  constructor() {
    this.select = new EventEmitter();
  }

  ngAfterViewInit() {
    this.fileInput.nativeElement.addEventListener("change", (ev: any) => {
      this.files = this.filterFiles(ev.target.files);
      this.select.emit(this.files);

      if (this.form && this._controlName) {
        this.form.patchValue({
          [this._controlName]: this.files
        });
      }
    });
  }

  @HostListener("dragover", ["$event"])
  onDragOver(ev: any): void {
    ev.preventDefault();
    ev.stopPropagation();

    this.dragover = true;
  }

  @HostListener("dragleave", ["$event"])
  onDragLeave(ev: any): void {
    ev.preventDefault();
    ev.stopPropagation();

    this.dragover = false;
  }

  @HostListener("drop", ["$event"])
  onDrop(ev: any): void {
    ev.preventDefault();
    ev.stopPropagation();

    this.dragover = false;
    this.files = this.filterFiles(ev.dataTransfer.files);
    this.select.emit(this.files);

    if (this.form && this._controlName) {
      this.form.patchValue({
        [this._controlName]: this.files
      });
    }
  }

  private filterFiles(files: FileList): File[] {
    const result: File[] = [];

    for (let i = 0; i < files.length; i++) {
      if (files[i].type && files[i].type.startsWith("video/")) {
        result.push(files[i]);
      }
    }

    return result;
  }
}
