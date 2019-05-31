import { Component, OnInit, Input } from '@angular/core';
import { UserDetails } from '../mock-data';

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.scss']
})
export class UsersTableComponent implements OnInit {
  displayedColumns = [
    'online',
    'username',
    'fullname',
    'email',
    'created',
    'role',
    'status',
    'action'
  ];
  @Input() users: UserDetails[] = [];

  constructor() {}

  ngOnInit() {}
}
