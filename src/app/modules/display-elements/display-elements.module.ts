import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { FormElementsModule } from "../form-elements/form-elements.module";
import { MaterialModule } from "../../material.module";
import { NgCircleProgressModule } from 'ng-circle-progress';

import { PageTitleComponent } from "./page-title/page-title.component";
import { TopNavComponent } from "./top-nav/top-nav.component";
import { CardTitleComponent } from "./card-title/card-title.component";
import { PermissionsModalComponent } from "./permissions-modal/permissions-modal.component";
import { InputElementsModule } from "../input-elements/input-elements.module";
import { AdminEventsFilterComponent } from "./admin-events-filter/admin-events-filter.component";
import { ActiveSessionsFilterComponent } from "./active-sessions-filter/active-sessions-filter.component";
import { DetailsDialogComponent } from "./details-dialog/details-dialog.component";
import { EventChipsComponent } from "./event-chips/event-chips.component";
import { FilterFieldComponent } from "./filter-field/filter-field.component";
import { LoginEventsFilterComponent } from "./login-events-filter/login-events-filter.component";
import { ConfirmDialogComponent } from "./confirm-dialog/confirm-dialog.component";
import { CompletionProgressComponent } from './completion-progress/completion-progress.component';
import { SignComponent } from './sign/sign.component';
import { MessageDialogComponent } from './message-dialog/message-dialog.component';
import { SignatureComponent } from './signature/signature.component';
import { PlatformModalComponent } from './platform-modal/platform-modal.component';
import { StaticTextFieldComponent } from './static-text-field/static-text-field.component';
import { ListviewToolbarComponent } from './listview-toolbar/listview-toolbar.component';
import { TableSelectModalComponent } from './table-select-modal/table-select-modal.component';
import { AvatarComponent } from './avatar/avatar.component';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { RoleBlockComponent } from './role-block/role-block.component';
import { MultiSelectToolbarComponent } from './multi-select-toolbar/multi-select-toolbar.component';
import { MicroappCardComponent } from './microapp-card/microapp-card.component';
import { VendorCardComponent } from './vendor-card/vendor-card.component';
import { MicroappIconComponent } from './microapp-icon/microapp-icon.component';
import { VendorIconComponent } from './vendor-icon/vendor-icon.component';
import { NgAppHeaderComponent } from './ng-app-header/ng-app-header.component';
import { NgSelectMenuComponent } from './ng-select-menu/ng-select-menu.component';
import { NgPageTabsComponent } from './ng-page-tabs/ng-page-tabs.component';
import { NgPageSidebarComponent } from './ng-page-sidebar/ng-page-sidebar.component';
import { NgSimpleTableComponent } from './ng-simple-table/ng-simple-table.component';
import { NgChipsAutocompleteComponent } from './ng-chips-autocomplete/ng-chips-autocomplete.component';

@NgModule({
  declarations: [
    PageTitleComponent,
    TopNavComponent,
    CardTitleComponent,
    PermissionsModalComponent,
    DetailsDialogComponent,
    AdminEventsFilterComponent,
    ActiveSessionsFilterComponent,
    EventChipsComponent,
    FilterFieldComponent,
    LoginEventsFilterComponent,
    ConfirmDialogComponent,
    CompletionProgressComponent,
    SignComponent,
    MessageDialogComponent,
    SignatureComponent,
    PlatformModalComponent,
    StaticTextFieldComponent,
    ListviewToolbarComponent,
    TableSelectModalComponent,
    AvatarComponent,
    ProgressBarComponent,
    RoleBlockComponent,
    MultiSelectToolbarComponent,
    MicroappCardComponent,
    VendorCardComponent,
    MicroappIconComponent,
    VendorIconComponent,
    NgAppHeaderComponent,
    NgSelectMenuComponent,
    NgPageTabsComponent,
    NgPageSidebarComponent,
    NgSimpleTableComponent,
    NgChipsAutocompleteComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MaterialModule,
    FormElementsModule,
    InputElementsModule,
    NgCircleProgressModule.forRoot({
      backgroundPadding: 0,
      radius: 15,
      space: -5,
      outerStrokeWidth: 5,
      innerStrokeWidth: 5,
      outerStrokeLinecap: "square",
      innerStrokeColor: "#ccc",
      titleFontSize: "14",
      titleFontWeight: "600",
      subtitleFontSize: "14",
      subtitleFontWeight: "600",
      animation: false,
      showSubtitle: false,
      showUnits: false
    })
  ],
  exports: [
    PageTitleComponent,
    TopNavComponent,
    CardTitleComponent,
    PermissionsModalComponent,
    DetailsDialogComponent,
    AdminEventsFilterComponent,
    ActiveSessionsFilterComponent,
    EventChipsComponent,
    FilterFieldComponent,
    LoginEventsFilterComponent,
    CompletionProgressComponent,
    SignComponent,
    SignatureComponent,
    PlatformModalComponent,
    StaticTextFieldComponent,
    ListviewToolbarComponent,
    AvatarComponent,
    ProgressBarComponent,
    RoleBlockComponent,
    MultiSelectToolbarComponent,
    MicroappCardComponent,
    VendorCardComponent,
    MicroappIconComponent,
    VendorIconComponent,
    NgAppHeaderComponent,
    NgSelectMenuComponent,
    NgPageTabsComponent,
    NgPageSidebarComponent,
    NgSimpleTableComponent,
    NgChipsAutocompleteComponent
  ],
  entryComponents: [
    DetailsDialogComponent,
    ConfirmDialogComponent,
    MessageDialogComponent,
    SignComponent,
    PlatformModalComponent,
    TableSelectModalComponent
  ]
})
export class DisplayElementsModule {}
