import { Component, OnInit, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {UsersService} from '../../../services/users.service';
import {UserProfile} from '../../../models/user-profile.model';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-user-picker',
  templateUrl: './user-picker.component.html',
  styleUrls: ['./user-picker.component.scss']
})
export class UserPickerComponent implements OnInit {

  selectedUsers: Array<UserProfile>;
  filteredUsers: Array<UserProfile>;
  timeoutRef: any;
  inputDisabled: boolean;

  @ViewChild('userInput') userInput: ElementRef<HTMLInputElement>;

  @Output() usersUpdated: EventEmitter<Array<string>>;

  constructor(private usersSvc: UsersService) { 
    this.selectedUsers = new Array<UserProfile>();
    this.filteredUsers = new Array<UserProfile>();
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
        (users: Array<UserProfile>) => {
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
    if (!this.selectedUsers.find((u: UserProfile) => u.id === $event.option.value)) {
      const user: UserProfile = this.filteredUsers.find((u: UserProfile) => u.id === $event.option.value);
      this.selectedUsers.push(user);
    }
    this.userInput.nativeElement.value = "";
    this.emitUserUpdates();
  }

  userRemoved(user: UserProfile): void {
    const index: number = this.selectedUsers.findIndex((u: UserProfile) => u.id === user.id);
    this.selectedUsers.splice(index, 1);
    this.emitUserUpdates();
  }

  private emitUserUpdates(): void {
    this.usersUpdated.emit(this.selectedUsers.map((u: UserProfile) => {
      return u.id;
    }));
  }

}
