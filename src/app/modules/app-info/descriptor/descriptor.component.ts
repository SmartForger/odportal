import { Component, OnInit, Input } from '@angular/core';
import {App} from '../../../models/app.model';

@Component({
  selector: 'app-descriptor',
  templateUrl: './descriptor.component.html',
  styleUrls: ['./descriptor.component.scss']
})
export class DescriptorComponent implements OnInit {

  @Input() app: App;

  constructor() { }

  ngOnInit() {
  }

}
