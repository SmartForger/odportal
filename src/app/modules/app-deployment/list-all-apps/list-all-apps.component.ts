/**
 * @description Lists active vendor apps in a table. Shows which apps are enabled.
 * @author Steven M. Redman
 */

import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { MatDialogRef, MatDialog } from "@angular/material";

import _ from "lodash";
import { Observable, Subscription, of, concat } from "rxjs";
import { map, catchError, toArray } from "rxjs/operators";

import { DirectQueryList } from "src/app/base-classes/direct-query-list";
import { PlatformModalComponent } from "../../display-elements/platform-modal/platform-modal.component";
import {
  PlatformModalType,
  PlatformModalModel,
} from "src/app/models/platform-modal.model";
import { App } from "src/app/models/app.model";
import { ApiSearchCriteria } from "src/app/models/api-search-criteria.model";
import { ApiSearchResult } from "src/app/models/api-search-result.model";
import { Vendor } from "src/app/models/vendor.model";
import { NotificationType } from "src/app/notifier/notificiation.model";
import { NotificationService } from "src/app/notifier/notification.service";
import { TableSelectionService } from "src/app/services/table-selection.service";
import { AppsService } from "src/app/services/apps.service";
import { Filters } from "src/app/util/filters";

@Component({
  selector: "app-list-all-apps",
  templateUrl: "./list-all-apps.component.html",
  styleUrls: ["./list-all-apps.component.scss"],
})
export class ListAllAppsComponent extends DirectQueryList<App>
  implements OnInit {
  searchCriteria: ApiSearchCriteria;
  selectedItems: Object;
  selectedCount: number;
  selectionSub: Subscription;
  selectedRowIndexArr = [];

  @Input() vendor: Vendor;
  @Output() upload: EventEmitter<any>;

  status: any;
  viewMode: string;
  vendorMap: Object;

  readonly menuOptions = [
    {
      display: "Active",
      value: "active",
    },
    {
      display: "Disabled",
      value: "disabled",
    },
    {
      display: "Pending",
      value: "pending",
    },
  ];

  selection = {
    approved: [], // approved apps; native + third party
    pending: [], // pending apps; third party
    disabled: [], // disabled apps; third party
    active: [], // active apps; third party
    thirdParty: [], // third party apps
  };

  constructor(
    private dialog: MatDialog,
    private appsSvc: AppsService,
    private notificationsSvc: NotificationService,
    protected selectionSvc: TableSelectionService
  ) {
    super(
      new Array<string>(
        "selection",
        "appTitle",
        "version",
        "widgets",
        "clientName",
        "vendor",
        "status",
        "actions"
      )
    );
    this.status = {
      active: false,
      disabled: false,
      pending: false,
    };
    this.vendor = {
      name: "",
      pocEmail: "",
      pocPhone: "",
    };
    this.upload = new EventEmitter();
    this.searchCriteria = new ApiSearchCriteria({ name: "" }, 0, "name", "asc");
    this.query = function (first: number, max: number) {
      return new Observable<Array<App>>((observer) => {
        this.appsSvc
          .listVendorApps1(this.vendor.docId, this.searchCriteria)
          .subscribe(
            (results: ApiSearchResult<App>) => {
              observer.next(results.data);
              observer.complete();
            },
            (err: any) => {
              observer.error(err);
              observer.complete();
            }
          );
      });
    }.bind(this);
    this.selectedItems = {};
    this.selectedCount = 0;
    this.selectionSvc.setCompareField("docId");
    this.selectionSvc.resetSelection();
  }

  ngOnInit() {
    super.ngOnInit();
    this.vendorMap = {
      [this.vendor.docId]: this.vendor.name,
    };
    this.selectionSub = this.selectionSvc.selection.subscribe((selected) => {
      this.selectedItems = selected;
      this.selectedCount = this.selectionSvc.getSelectedCount();
      this.highlightRow();
      const selectedApps = this.selectionSvc.getSelectedItems();
      this.selection.approved = selectedApps.filter(
        (app: App) => app.approved || app.native
      );
      this.selection.pending = selectedApps.filter(
        (app: App) => !app.approved && !app.native
      );
      this.selection.disabled = selectedApps.filter(
        (app: App) => !app.native && app.approved && !app.enabled
      );
      this.selection.active = selectedApps.filter(
        (app: App) => !app.native && app.approved && app.enabled
      );
      this.selection.thirdParty = selectedApps.filter(
        (app: App) => !app.native
      );
    });
  }

  ngOnDestroy() {
    this.selectionSub.unsubscribe();
  }

  get totalApps() {
    let str = this.paginator.length + " Total Microapp";
    return this.paginator.length > 1 ? str + "s" : str;
  }

  updateStatus(statusArr: string[]) {
    this.searchCriteria.filters.status = statusArr.join(",");
    this.refresh();
  }

  isAllSelected() {
    let result = true;
    this.displayItems.forEach((item) => {
      result = this.selectedItems[item.docId] && result;
    });
    return result;
  }

  toggleAllSelection() {
    const selected = this.isAllSelected();
    this.selectionSvc.selectBatch(this.displayItems, !selected);
  }

  enableSelectedApps() {
    let clientApps: any = {};

    this.selection.disabled.forEach((app: App) => {
      if (!clientApps[app.clientId]) {
        clientApps[app.clientId] = app;
      } else if (
        this.compareVersions(clientApps[app.clientId].version, app.version) < 0
      ) {
        clientApps[app.clientId] = app;
      }
    });

    const selectedApps: App[] = Object.values(clientApps);

    this.displayConfirmModal(
      {
        title: "Enable microapps",
        subtitle: "Are you sure you want to enable following microapps?",
        submitButtonTitle: "Enable",
        submitButtonClass: "bg-blue",
        formFields: [],
      },
      selectedApps,
      () => {
        const observables = selectedApps.map((app: App) =>
          this.appsSvc.update({ ...app, enabled: true }).pipe(
            map((updated: App) => {
              this.appsSvc.appUpdated(updated);
              app.enabled = true;
              this.selectionSvc.toggleItem(app);
              return updated;
            }),
            catchError((err) => of(err))
          )
        );

        this.callAPIsSequence(observables).subscribe(({ success, failed }) => {
          let message = `${this.pluralize(success)} enabled successfully`;
          if (failed > 0) {
            message += ` but ${this.pluralize(failed)} failed`;
          }

          this.notificationsSvc.notify({
            type: NotificationType.INFO,
            message,
          });

          this.refresh();
          this.selectionSvc.resetSelection();
        });
      }
    );
  }

  disableSelectedApps() {
    this.displayConfirmModal(
      {
        title: "Disable microapps",
        subtitle: "Are you sure you want to disable following microapps?",
        submitButtonTitle: "Disable",
        submitButtonClass: "bg-red",
        formFields: [],
      },
      this.selection.active,
      () => {
        const observables = this.selection.active.map((app: App) =>
          this.appsSvc.update({ ...app, enabled: false }).pipe(
            map((updated: App) => {
              this.appsSvc.appUpdated(updated);
              app.enabled = false;
              this.selectionSvc.toggleItem(app);
              return updated;
            }),
            catchError((err) => of(err))
          )
        );
        this.callAPIsSequence(observables).subscribe(({ success, failed }) => {
          let message = `${this.pluralize(success)} disabled successfully`;
          if (failed > 0) {
            message += ` but ${this.pluralize(failed)} failed`;
          }
          this.notificationsSvc.notify({
            type: NotificationType.INFO,
            message,
          });
          this.refresh();
        });
      }
    );
  }

  filterApps(keyword: string): void {
    if (this.allItemsFetched) {
      const filterKeys = ["appTitle"];
      this.filteredItems = Filters.filterByKeyword(
        filterKeys,
        keyword,
        this.items
      );
      this.page = 0;
      this.listDisplayItems();
    }
  }

  protected filterItems(): void {
    if (this.allItemsFetched) {
      if (this.sortColumn === "") {
        this.sortColumn = "appTitle";
      }
      this.filteredItems.sort((a: App, b: App) => {
        const sortOrder = this.sort.direction === "desc" ? -1 : 1;
        return a[this.sortColumn] < b[this.sortColumn]
          ? -1 * sortOrder
          : sortOrder;
      });
      this.listDisplayItems();
    }
  }

  private pluralize(count, word = "application") {
    return `${count} ${word}${count > 1 ? "s" : ""}`;
  }

  private compareVersions(v1, v2) {
    const formatVersion = (v) => {
      v = v.match(/\d+(\.\d+)*/);
      return v ? v[0].split(".") : [0];
    };

    v1 = formatVersion(v1 || "");
    v2 = formatVersion(v2 || "");
    const c = Math.max(v1.length, v2.length);

    for (let i = 0; i < c; i++) {
      const v1_i = +v1[i] || 0;
      const v2_i = +v2[i] || 0;

      if (v1_i < v2_i) {
        return -1;
      } else if (v1_i > v2_i) {
        return 1;
      }
    }

    return 0;
  }

  private displayConfirmModal(
    config: PlatformModalModel,
    apps: App[],
    callback: () => void
  ) {
    config.type = PlatformModalType.SECONDARY;
    let fieldValue = apps
      .slice(0, 5)
      .map((app: App) =>
        app.native ? app.appTitle : `${app.appTitle}(${app.version})`
      )
      .join(", ");
    if (apps.length > 5) {
      fieldValue += ` and +${this.pluralize(apps.length - 5)}`;
    }
    config.formFields.push({
      type: "static",
      label: "Selected applications",
      defaultValue: fieldValue,
      fullWidth: true,
    });

    let modalRef: MatDialogRef<PlatformModalComponent> = this.dialog.open(
      PlatformModalComponent,
      { data: config }
    );

    modalRef.afterClosed().subscribe((data) => {
      if (data) {
        callback();
      }
    });
  }

  private callAPIsSequence(observables) {
    return concat(...observables).pipe(
      toArray(),
      map((result: any[]) => {
        let failed = 0;
        result.forEach((response: any) => {
          if (response instanceof Error) {
            failed++;
          }
        });

        return {
          failed,
          success: result.length - failed,
          responses: result,
        };
      })
    );
  }
  highlightRow(): void {
    this.selectedRowIndexArr = this.selectionSvc.getSelectedItems();
  }
}
