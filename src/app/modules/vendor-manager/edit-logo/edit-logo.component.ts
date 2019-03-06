import { Component, OnInit, Input, ViewChild } from '@angular/core';
import {Vendor} from '../../../models/vendor.model';
import {VendorsService} from '../../../services/vendors.service';
import {DragDropFilePickerComponent} from '../../file-pickers/drag-drop-file-picker/drag-drop-file-picker.component';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-edit-logo',
  templateUrl: './edit-logo.component.html',
  styleUrls: ['./edit-logo.component.scss']
})
export class EditLogoComponent implements OnInit {

  fileBasePath: string;
  imagePreviewData: string;
  private activeFile: File;

  @Input() vendor: Vendor;

  @ViewChild(DragDropFilePickerComponent) filePicker: DragDropFilePickerComponent;

  constructor(
    private vendorsSvc: VendorsService,
    private authSvc: AuthService) { }

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
      
    }
  }

}
