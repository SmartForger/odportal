import { Component, Output, EventEmitter, ElementRef, Inject } from "@angular/core";
import { App } from "src/app/models/app.model";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { PlatformModalType } from "src/app/models/platform-modal.model";

interface AppPickerModalModel {
  apps: App[];
}

@Component({
  selector: "app-app-picker-modal",
  templateUrl: "./app-picker-modal.component.html",
  styleUrls: ["./app-picker-modal.component.scss"]
})
export class AppPickerModalComponent {

  @Output() selectApp: EventEmitter<string>;

  constructor(
    private dlgRef: MatDialogRef<AppPickerModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AppPickerModalModel
  ) {
    this.selectApp = new EventEmitter<string>();
    this.dlgRef.addPanelClass("platform-modal");
    this.dlgRef.addPanelClass(PlatformModalType.PRIMARY);
  }

  getAppDisplay(app: App): string {
    if (app.version) {
      return `${app.appTitle} (v ${app.version})`;
    } else {
      return app.appTitle;
    }
  }

  private appSort(a: App, b: App): number {
    if (a.appTitle === b.appTitle) {
      if (a.version > b.version) {
        return -1;
      } else if (a.version < b.version) {
        return 1;
      } else {
        return 0;
      }
    } else if (a.appTitle > b.appTitle) {
      return 1;
    } else {
      return -1;
    }
  }
}
