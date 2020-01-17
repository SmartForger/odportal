import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { FormElementsModule } from "../form-elements/form-elements.module";
import { MaterialModule } from "../../material.module";
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
    TableSelectModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    FormElementsModule,
    MaterialModule,
    InputElementsModule
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
    ListviewToolbarComponent
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
