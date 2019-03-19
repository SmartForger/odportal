import { Component, OnInit, Input } from '@angular/core';
import {ApiCallDescriptor} from '../../../models/api-call-descriptor.model';

@Component({
  selector: 'app-sandbox-api-call-list',
  templateUrl: './sandbox-api-call-list.component.html',
  styleUrls: ['./sandbox-api-call-list.component.scss']
})
export class SandboxApiCallListComponent implements OnInit {

  @Input() apiCalls: Array<ApiCallDescriptor>;

  constructor() { 
    this.apiCalls = new Array<ApiCallDescriptor>();
  }

  ngOnInit() {
  }

}
