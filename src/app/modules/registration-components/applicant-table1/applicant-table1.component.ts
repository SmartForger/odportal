import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { SSPList } from '../../../base-classes/ssp-list';
import { ApiSearchCriteria } from '../../../models/api-search-criteria.model';

@Component({
  selector: 'app-applicant-table1',
  templateUrl: './applicant-table1.component.html',
  styleUrls: ['./applicant-table1.component.scss']
})
export class ApplicantTable1Component extends SSPList<Object> implements OnInit {
  headerColumns: Array<string>;
  secColumns: Array<Object>;
  reqColumns: Array<Object>;
  verColumns: Array<Object>;

  @Output() userEdit: EventEmitter<Object>;

  constructor() { 
    super(
      new Array<string>(
        "username", "fullname", "sec_unc", "sec_sec", "sec_top", "sec_oth",
        "req_org", "req_con", "req_tra", "req_org1", "ver_inf1", "ver_inf2",
        "ver_sup", "ver_sec", "progress", "status", "actions"
      ),
      new ApiSearchCriteria(
        { username: "" }, 0, "username", "asc"
      )
    );
    this.searchCriteria.pageSize = 10;
    this.headerColumns = [
      "identity", "sec_class", "req_roles", "ver_needed"
    ];
    this.secColumns = [
      {
        field: "sec_unc",
        label: "Unc",
        class: "border-left pl-2"
      },
      {
        field: "sec_sec",
        label: "Sec"
      },
      {
        field: "sec_top",
        label: "Top"
      },
      {
        field: "sec_oth",
        label: "Oth"
      }
    ];
    this.reqColumns = [
      {
        field: "req_org",
        label: "Org",
        class: "border-left pl-2"
      },
      {
        field: "req_con",
        label: "Con"
      },
      {
        field: "req_tra",
        label: "Tra"
      },
      {
        field: "req_org1",
        label: "Org"
      }
    ];
    this.verColumns = [
      {
        field: "ver_inf1",
        label: "Inf",
        class: "border-left pl-2"
      },
      {
        field: "ver_inf2",
        label: "Inf"
      },
      {
        field: "ver_sup",
        label: "Sup"
      },
      {
        field: "ver_sec",
        label: "Sec"
      }
    ];
    this.userEdit = new EventEmitter<Object>();
  }

  ngOnInit() {
    this.listItems();
  }

  editUser(row: Object): void {
    this.userEdit.emit(row);
  }

  get totalRegistrations() {
    let str = this.paginator.length + ' Total Registration';
    return this.paginator.length > 1 ? str + 's' : str;
  }

  listItems(): void {
    this.items = [
      {
        username: "afarnsworth",
        fullname: "Andy Farnsworth",
        sec_unc: true,
        sec_sec: true,
        sec_top: true,
        sec_oth: true,
        req_org: true,
        req_con: true,
        req_tra: false,
        req_org1: false,
        ver_inf1: 2,
        ver_inf2: 1,
        ver_sup: 2,
        ver_sec: 0,
        progress: 33,
        status: 'open'
      },
      {
        username: "afarnsworth",
        fullname: "Andy Farnsworth",
        sec_unc: true,
        sec_sec: true,
        sec_top: true,
        sec_oth: false,
        req_org: true,
        req_con: false,
        req_tra: false,
        req_org1: false,
        ver_inf1: 1,
        ver_inf2: 1,
        ver_sup: 2,
        ver_sec: 2,
        progress: 50,
        status: 'complete'
      }
    ];
  }

}
