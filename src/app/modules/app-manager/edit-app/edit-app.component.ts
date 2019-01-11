import { Component, OnInit, ViewChild } from '@angular/core';
import {App} from '../../../models/app.model';
import {AppsService} from '../../../services/apps.service';
import {ActivatedRoute} from '@angular/router';
import {NativeAppInfoFormComponent} from '../native-app-info-form/native-app-info-form.component';
import {ComparisonUpdater} from '../../../util/comparison-updater';
import {NotificationType} from '../../../notifier/notificiation.model';
import {NotificationService} from '../../../notifier/notification.service';
import {ModalComponent} from '../../display-elements/modal/modal.component';

@Component({
  selector: 'app-edit-app',
  templateUrl: './edit-app.component.html',
  styleUrls: ['./edit-app.component.scss']
})
export class EditAppComponent implements OnInit {

  app: App;

  @ViewChild(NativeAppInfoFormComponent) private nativeInfoForm: NativeAppInfoFormComponent;
  @ViewChild('enableModal') private enableModal: ModalComponent;
  @ViewChild('disableModal') private disableModal: ModalComponent;

  constructor(
    private appsSvc: AppsService, 
    private route: ActivatedRoute,
    private notifySvc: NotificationService) { 

  }

  ngOnInit() {
    this.fetchApp();
  }

  updateNativeApp(app: App): void {
    const fullApp: App = ComparisonUpdater.updateObject<App>(app, this.app);
    this.appsSvc.update(fullApp).subscribe(
      (app: App) => {
        this.app = app;
        this.notifySvc.notify({
          type: NotificationType.Success,
          message: this.app.appTitle + " was updated successfully"
        });
        this.appsSvc.appUpdated(app);
      },
      (err: any) => {
        this.notifySvc.notify({
          type: NotificationType.Error,
          message: "There was a problem while updating " + this.app.appTitle
        });
      }
    );
  }

  enableButtonClicked(enable: boolean): void {
    this.showEnableOrDisableModal(enable);
  }

  enableConfirmed(btnText: string, enable: boolean): void {
    this.hideEnableOrDisableModal(enable);
    this.app.enabled = enable;
    this.appsSvc.update(this.app).subscribe(
      (app: App) => {
        let message: string = this.app.appTitle + " was ";
        if (enable) {
          message += "enabled successfully";
        }
        else {
          message += "disabled successfully";
        }
        this.notifySvc.notify({
          type: NotificationType.Success,
          message: message
        });
        this.appsSvc.appUpdated(app);
      },
      (err: any) => {
        let message: string = "There was a problem while ";
        if (enable) {
          message += "enabling " + this.app.appTitle;
        }
        else {
          message += "disabling " + this.app.appTitle;
        }
        this.notifySvc.notify({
          type: NotificationType.Error,
          message: message
        });
      }
    );
  }

  private showEnableOrDisableModal(enable: boolean): void {
    if (enable) {
      this.enableModal.show = true;
    }
    else {
      this.disableModal.show = true;
    }
  }

  private hideEnableOrDisableModal(enable: boolean): void {
    if (enable) {
      this.enableModal.show = false;
    }
    else {
      this.disableModal.show = false;
    }
  }

  private fetchApp(): void {
    this.appsSvc.fetch(this.route.snapshot.params['id']).subscribe(
      (app: App) => {
        this.app = app;
        this.nativeInfoForm.setForm(app);
      },
      (err: any) => {
        console.log(err);
      }
    );
  }


}
