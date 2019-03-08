import { Component, OnInit, Input, ViewChild } from '@angular/core';
import {Vendor} from '../../../models/vendor.model';
import {VendorsService} from '../../../services/vendors.service';
import {DragDropFilePickerComponent} from '../../file-pickers/drag-drop-file-picker/drag-drop-file-picker.component';
import {AuthService} from '../../../services/auth.service';
import {HttpEvent, HttpEventType} from '@angular/common/http';
import {NotificationService} from '../../../notifier/notification.service';
import {NotificationType} from '../../../notifier/notificiation.model';

@Component({
  selector: 'app-edit-logo',
  templateUrl: './edit-logo.component.html',
  styleUrls: ['./edit-logo.component.scss']
})
export class EditLogoComponent implements OnInit {

  fileBasePath: string;
  imagePreviewData: string;
  activeFile: File;
  uploadProgress: number;

  @Input() vendor: Vendor;
  @Input() canUpdate: boolean;

  @ViewChild(DragDropFilePickerComponent) filePicker: DragDropFilePickerComponent;

  constructor(
    private vendorsSvc: VendorsService,
    private authSvc: AuthService,
    private notifySvc: NotificationService) { 
      this.uploadProgress = 0;
      this.canUpdate = false;
    }

  ngOnInit() {
    this.fileBasePath = this.authSvc.globalConfig.vendorsServiceConnection + 'logos/';
  }

  fileChosen(file: File): void {
    this.activeFile = file;
    let fr: FileReader = new FileReader();
    fr.onloadend = ($event: ProgressEvent) => {
      this.imagePreviewData = fr.result.toString();
    };
    fr.readAsDataURL(file);
  }

  confirmFile(): void {
    if (this.activeFile) {
      this.vendorsSvc.updateVendorLogo(this.vendor.docId, this.activeFile).subscribe(
        (event: HttpEvent<Vendor>) => {
          if (event.type === HttpEventType.UploadProgress) {
            const progress: number = Math.round(100 * (event.loaded / event.total));
            this.uploadProgress = progress;
          }
          else if (event.type === HttpEventType.Response) {
            this.uploadProgress = 0;
            this.activeFile = null;
            this.filePicker.clear();
            this.vendor.logoImage = event.body.logoImage;
          }
        },
        (err: any) => {
          console.log(err);
          this.notifySvc.notify({
            type: NotificationType.Error,
            message: "There was a problem while uploading your file"
          });
        }
      );
    }
  }

}
