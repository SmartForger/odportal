import { Component, OnInit } from '@angular/core';
import {RolesService} from '../../../services/roles.service';

@Component({
  selector: 'app-list-roles',
  templateUrl: './list-roles.component.html',
  styleUrls: ['./list-roles.component.scss']
})
export class ListRolesComponent implements OnInit {

  constructor(private rolesSvc: RolesService) { }

  ngOnInit() {
    this.rolesSvc.list().subscribe(
      (data: any) => {
        console.log(data);
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

}
