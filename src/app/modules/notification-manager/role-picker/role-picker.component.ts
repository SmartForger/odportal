import { Component, OnInit, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {RolesService} from '../../../services/roles.service';
import {Role} from '../../../models/role.model';

@Component({
  selector: 'app-role-picker',
  templateUrl: './role-picker.component.html',
  styleUrls: ['./role-picker.component.scss']
})
export class RolePickerComponent implements OnInit {

  roles: Array<Role>;
  selectedRoles: Array<string>;
  filteredRoles: Array<Role>;

  @ViewChild('roleInput') roleInput: ElementRef<HTMLInputElement>;

  @Output() rolesUpdated: EventEmitter<Array<string>>;

  constructor(private rolesSvc: RolesService) { 
    this.roles = new Array<Role>();
    this.selectedRoles = new Array<string>();
    this.filteredRoles = new Array<Role>();
    this.rolesUpdated = new EventEmitter<Array<string>>();
  }

  ngOnInit() {
    this.listRoles();
  }

  roleInputChanged($event: any): void {
    const value: string = this.roleInput.nativeElement.value.trim().toLowerCase();
    if (value) {
      this.filteredRoles = this.roles.filter((r: Role) => r.name.toLowerCase().includes(value));
    }
    else {
      this.filteredRoles = this.roles;
    }
  }

  roleSelected($event: MatAutocompleteSelectedEvent): void {
    if (!this.selectedRoles.includes($event.option.value)) {
      this.selectedRoles.push($event.option.value);
    }
    this.roleInput.nativeElement.value = "";
    this.rolesUpdated.emit(this.selectedRoles);
  }

  roleRemoved(roleName: string): void {
    const index: number = this.selectedRoles.indexOf(roleName);
    this.selectedRoles.splice(index, 1);
    this.rolesUpdated.emit(this.selectedRoles);
  }

  private listRoles(): void {
    this.rolesSvc.list().subscribe(
      (roles: Array<Role>) => {
        this.roles = roles;
        this.filteredRoles = roles;
      }
    );
  }

}
