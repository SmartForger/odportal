/**
 * @description Manages options for the user dashboard: set title, set description, choose active dashboard, edit/delete options, etc.
 * @author James Marcu
 */

import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material";

import { AuthService } from "src/app/services/auth.service";
import { DashboardService } from "src/app/services/dashboard.service";
import { UserDashboard } from "src/app/models/user-dashboard.model";
import { WidgetModalService } from "src/app/services/widget-modal.service";
import { PlatformModalComponent } from "../../display-elements/platform-modal/platform-modal.component";
import { PlatformModalType } from "src/app/models/platform-modal.model";
import { Validators } from "@angular/forms";

@Component({
  selector: "app-dashboard-options",
  templateUrl: "./dashboard-options.component.html",
  styleUrls: ["./dashboard-options.component.scss"]
})
export class DashboardOptionsComponent implements OnInit {
  @Input() userDashboards: Array<UserDashboard>;
  @Input() dashIndex: number;
  @Input() editMode: boolean;

  @Output() setDashboard: EventEmitter<number>;
  @Output() enterEditMode: EventEmitter<void>;
  @Output() leaveEditMode: EventEmitter<boolean>;

  constructor(
    private authSvc: AuthService,
    private dashSvc: DashboardService,
    private dialog: MatDialog,
    private widgetModalSvc: WidgetModalService
  ) {
    this.userDashboards = new Array<UserDashboard>();
    this.dashIndex = 0;
    this.editMode = false;

    this.setDashboard = new EventEmitter<number>();
    this.enterEditMode = new EventEmitter<void>();
    this.leaveEditMode = new EventEmitter<boolean>();
  }

  ngOnInit() {}

  setDashboardDetails(isCreating = false) {
    let modalRef: MatDialogRef<PlatformModalComponent> = this.dialog.open(
      PlatformModalComponent, {
        data: {
          type: PlatformModalType.PRIMARY,
          title: isCreating ? "Create dashboard" : "Dashboard details",
          submitButtonTitle: isCreating ? "Create dashboard" : "Update dashboard",
          formFields: [
            {
              type: "text-input",
              name: 'title',
              label: "Dashboard name",
              defaultValue: this.userDashboards[this.dashIndex].title
                ? this.userDashboards[this.dashIndex].title
                : "",
              validators: [Validators.required]
            }
          ]
        }
      }
    );
    modalRef.afterClosed().subscribe(data => {
      if (data) {
        this.userDashboards[this.dashIndex].title = data.title;
      }
    });
  }

  createNewDashboard() {
    this.dashSvc
      .addDashboard(
        UserDashboard.createDefaultDashboard(this.authSvc.getUserId())
      )
      .subscribe(dashboard => {
        this.userDashboards.push(dashboard);
        this.dashIndex = this.userDashboards.length - 1;
        this.setDashboard.emit(this.dashIndex);
        this.enterEditMode.emit();
        this.setDashboardDetails();
      });
  }

  deleteDashboard() {
    let modalRef: MatDialogRef<PlatformModalComponent> = this.dialog.open(
      PlatformModalComponent,
      {
        data: {
          title: "Delete Dashboard",
          subtitle: "Are you sure you want to delete this dashboard?",
          type: PlatformModalType.SECONDARY,
          submitButtonTitle: "Delete dashboard permanently",
          formFields: [
            {
              type: "static",
              label: "Dashboard Name",
              defaultValue: this.userDashboards[this.dashIndex].title,
              fullWidth: true
            },
            {
              type: "static",
              label: "Number of widgets",
              defaultValue: 6
            }
          ]
        }
      }
    );

    modalRef.afterClosed().subscribe(data => {
      if (data) {
        this.leaveEditMode.emit(true);

        if (this.userDashboards[this.dashIndex].docId) {
          this.dashSvc
            .deleteDashboard(this.userDashboards[this.dashIndex].docId)
            .subscribe(dashboard => {
              this.deleteLocalDashboard();
            });
        } else {
          this.deleteLocalDashboard();
        }
      }
    });
  }

  setDefault(): void {
    if (this.userDashboards[this.dashIndex].docId) {
      this.dashSvc
        .setDefaultDashboard(this.userDashboards[this.dashIndex].docId)
        .subscribe();
    }
  }

  addWidget(): void {
    this.widgetModalSvc.show();
  }

  private deleteLocalDashboard() {
    this.userDashboards.splice(this.dashIndex, 1);
    if (this.dashIndex >= this.userDashboards.length) {
      this.setDashboard.emit(this.userDashboards.length - 1);
    } else {
      this.setDashboard.emit(this.dashIndex);
    }
    this.leaveEditMode.emit(false);
  }
}
