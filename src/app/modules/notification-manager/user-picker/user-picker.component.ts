import { Component, OnInit, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {UsersService} from '../../../services/users.service';
import {UserProfileKeycloak} from '../../../models/user-profile.model';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-user-picker',
  templateUrl: './user-picker.component.html',
  styleUrls: ['./user-picker.component.scss']
})
export class UserPickerComponent implements OnInit {

  selectedUsers: Array<UserProfileKeycloak>;
  filteredUsers: Array<UserProfileKeycloak>;
  timeoutRef: any;
  inputDisabled: boolean;

  @ViewChild('userInput') userInput: ElementRef<HTMLInputElement>;

  @Output() usersUpdated: EventEmitter<Array<string>>;

  constructor(private usersSvc: UsersService) { 
    this.selectedUsers = new Array<UserProfileKeycloak>();
    this.filteredUsers = new Array<UserProfileKeycloak>();
    this.usersUpdated = new EventEmitter<Array<string>>();
    this.timeoutRef = null;
    this.inputDisabled = false;
  }

  ngOnInit() {
  }

  userInputChanged($event: any): void {
    if (this.timeoutRef) {
      clearTimeout(this.timeoutRef);
      this.timeoutRef = null;
    }
    this.timeoutRef = setTimeout(() => {
      this.inputDisabled = true;
      this.usersSvc.listUsers({search: this.userInput.nativeElement.value}).subscribe(
        (users: Array<UserProfileKeycloak>) => {
          this.filteredUsers = users;
          this.inputDisabled = false;
        },
        (err: any) => {
          console.log(err);
          this.inputDisabled = false;
        }
      );
    }, 1000);
  }

  userSelected($event: MatAutocompleteSelectedEvent): void {
    if (!this.selectedUsers.find((u: UserProfileKeycloak) => u.id === $event.option.value)) {
      const user: UserProfileKeycloak = this.filteredUsers.find((u: UserProfileKeycloak) => u.id === $event.option.value);
      this.selectedUsers.push(user);
    }
    this.userInput.nativeElement.value = "";
    this.emitUserUpdates();
  }

  userRemoved(user: UserProfileKeycloak): void {
    const index: number = this.selectedUsers.findIndex((u: UserProfileKeycloak) => u.id === user.id);
    this.selectedUsers.splice(index, 1);
    this.emitUserUpdates();
  }

  private emitUserUpdates(): void {
    this.usersUpdated.emit(this.selectedUsers.map((u: UserProfileKeycloak) => {
      return u.id;
    }));
  }

}
