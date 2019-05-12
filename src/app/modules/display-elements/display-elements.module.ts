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
import { ConfirmModalComponent } from "./confirm-modal/confirm-modal.component";
import { AdminEventsFilterComponent } from "./admin-events-filter/admin-events-filter.component";
import { DetailsDialogComponent } from "./details-dialog/details-dialog.component";
import { EventChipsComponent } from "./event-chips/event-chips.component";
import { FilterFieldComponent } from "./filter-field/filter-field.component";
import { LoginEventsFilterComponent } from "./login-events-filter/login-events-filter.component";

@NgModule({
  declarations: [
    PageTitleComponent,
    TopNavComponent,
    CardTitleComponent,
    PermissionsModalComponent,
    ConfirmModalComponent,
    DetailsDialogComponent,
    AdminEventsFilterComponent,
    EventChipsComponent,
    FilterFieldComponent,
    LoginEventsFilterComponent
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
    EventChipsComponent,
    FilterFieldComponent,
    LoginEventsFilterComponent
  ],
  entryComponents: [ConfirmModalComponent, DetailsDialogComponent]
})
export class DisplayElementsModule {}
