import { Component, AfterViewInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PlatformModalType } from 'src/app/models/platform-modal.model';
import { VideoModel } from 'src/app/models/video.model';
import { VideoService } from 'src/app/services/video.service';

@Component({
  selector: 'app-video-edit-dialog',
  templateUrl: './video-edit-dialog.component.html',
  styleUrls: ['./video-edit-dialog.component.scss']
})
export class VideoEditDialogComponent implements AfterViewInit  {
  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>;
  @ViewChild('videoPreview') videoPreview: ElementRef<HTMLVideoElement>;

  statusOptions: any = {
    published: {
      value: 'published',
      label: 'Published',
      color: '#0AA649'
    },
    draft: {
      value: 'draft',
      label: 'Draft',
      color: '#F0905C'
    }
  };

  form: FormGroup;
  videoFile: File;
  updating: boolean = false;

  constructor(
    private dlgRef: MatDialogRef<VideoEditDialogComponent>,
    private videoSvc: VideoService,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public video: VideoModel
  ) {
    this.dlgRef.addPanelClass("platform-modal");
    this.dlgRef.addPanelClass("max-w800");
    this.dlgRef.addPanelClass(PlatformModalType.PRIMARY);

    const arrayRequired = (control: AbstractControl) => {
      return control.value && control.value.length > 0 ? null : { arrayRequired: true };
    };

    this.form = this.formBuilder.group({
      docId: video.docId,
      name: [video.name, Validators.required],
      description: [video.description, Validators.required],
      status: [video.status, Validators.required],
      keywords: [video.keywords, arrayRequired],
      video: null
    });
  }

  ngAfterViewInit() {
    this.fileInput.nativeElement.addEventListener("change", (ev: any) => {
      const files = this.filterFiles(ev.target.files);

      if (files.length > 0) {
        this.videoFile = files[0];
        let blobURL = URL.createObjectURL(this.videoFile);
        this.videoPreview.nativeElement.src = blobURL;
        this.form.get('video').markAsTouched();

        this.form.patchValue({
          video: this.videoFile
        });
      } else {
        this.videoFile = null;

        this.form.patchValue({
          video: null
        });
      }
    });
  }

  get thumbnailSrc() {
    return `${this.videoSvc.getUploadPath()}/${this.video.thumbnail}`;
  }

  get statuses() {
    return Object.values(this.statusOptions);
  }

  get currentStatus() {
    const st = this.form.get('status').value;
    return this.statusOptions[st] || {};
  }

  update() {
    this.updating = true;
    this.videoSvc.updateVideo(this.form.value)
      .subscribe(
        (data: VideoModel) => {
          this.dlgRef.close(data);
        },
        () => {
          this.dlgRef.close();
        }
      );
  }

  preview() {
    this.dlgRef.close('preview');
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
