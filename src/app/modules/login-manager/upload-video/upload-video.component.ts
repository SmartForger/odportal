import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { PlatformModalType } from 'src/app/models/platform-modal.model';
import { VideoModel } from 'src/app/models/video.model';

@Component({
  selector: 'app-upload-video-dialog',
  templateUrl: './upload-video.component.html',
  styleUrls: ['./upload-video.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UploadVideoComponent {
  step = 0;
  videoStepForm: FormGroup;
  videoDetailsForm: FormGroup;

  constructor(
    private dlgRef: MatDialogRef<UploadVideoComponent>,
    private formBuilder: FormBuilder
  ) {
    this.dlgRef.addPanelClass("platform-modal");
    this.dlgRef.addPanelClass("upload-video-modal");
    this.dlgRef.addPanelClass(PlatformModalType.PRIMARY);

    const arrayRequired = (control: AbstractControl) => {
      return control.value && control.value.length > 0 ? null : { arrayRequired: true };
    };

    this.videoStepForm = this.formBuilder.group({
      videos: [null, arrayRequired]
    });
    this.videoDetailsForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      keywords: [null, arrayRequired]
    });
  }

  changeStep(ev: any) {
    this.step = ev.selectedIndex;
  }

  nextStep() {
    this.step ++;
  }

  handleUploaded(video: VideoModel) {
    this.dlgRef.close(video);
  }
}
