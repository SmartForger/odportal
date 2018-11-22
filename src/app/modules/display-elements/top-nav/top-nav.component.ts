import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss']
})
export class TopNavComponent implements OnInit {

  @Input() pageTitle: string;
  @Input() pageTitleClassList: string;
  @Input() labels: Array<string>;
  @Input() links: Array<string>;
  @Input() linkListClassList: string;

  constructor() { 
    this.pageTitle = "";
    this.pageTitleClassList = "navbar-brand";
    this.linkListClassList = "navbar-top-links rmf-top-nav";
  }

  ngOnInit() {
  }

}
