import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UserDetails, emptyUser, users } from '../../registration-manager/mock-data';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  details: UserDetails = emptyUser;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.details = users.find(user => user.id === id) || emptyUser;
  }

}
