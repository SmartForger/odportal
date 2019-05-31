import { Component, OnInit } from '@angular/core';
import { UserDetails, users } from '../../registration-manager/mock-data';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  userList: UserDetails[] = users;

  constructor() { }

  ngOnInit() {
  }
}
