import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { SSPList } from '../../../base-classes/ssp-list';
import { ApiSearchCriteria } from '../../../models/api-search-criteria.model';
import { RegistrationService } from 'src/app/services/registration.service';
import { Registration } from 'src/app/models/registration.model';

@Component({
  selector: 'app-workflow-table',
  templateUrl: './workflow-table.component.html',
  styleUrls: ['./workflow-table.component.scss']
})
export class WorkflowTableComponent extends SSPList<Object> implements OnInit {
  headerColumns: Array<string>;
  init: boolean;

  @Output() edit: EventEmitter<Object>;

  constructor(private regProcSvc: RegistrationService) { 
    // super(
    //   new Array<string>(
    //     "workflow", "participants", "open", "closed", "conversion", "actions"
    //   ),
    //   new ApiSearchCriteria(
    //     { workflow: "" }, 0, "workflow", "asc"
    //   )
    // );
    super(
      new Array<string>(
        "workflow", "actions"
      ),
      new ApiSearchCriteria(
        { workflow: "" }, 0, "workflow", "asc"
      )
    );
    this.searchCriteria.pageSize = 10;
    this.edit = new EventEmitter<Object>();
    this.init = false;
  }

  ngOnInit() {
    this.listItems();
  }

  editUser(row: Object): void {
    this.edit.emit(row);
  }

  get totalWorkflows() {
    let str = this.paginator.length + ' Total Workflow';
    return this.paginator.length > 1 ? str + 's' : str;
  }

  listItems(): void {
    // this.items = [
    //   {
    //     id: 'pcte-general-user-registration',
    //     workflow: "PCTE General User Registration",
    //     participants: 234,
    //     open: 64,
    //     closed: 64,
    //     conversion: 50
    //   },
    //   {
    //     workflow: "PCTE General User Registration",
    //     participants: 2456,
    //     open: 654,
    //     closed: 654,
    //     conversion: 33
    //   }
    // ];

    this.regProcSvc.listProcesses().subscribe((procs: Array<Registration>) => {
        this.items = new Array();
        procs.forEach((proc: Registration) => {
            this.items.push({
                id: proc.docId,
                workflow: proc.title,
                participants: '-',
                open: '-',
                closed: '-',
                conversion: '-'
            });
        });
        // this.init = true;
    });
  }

}
