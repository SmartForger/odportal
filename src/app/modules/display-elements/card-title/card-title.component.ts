import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-card-title',
  templateUrl: './card-title.component.html',
  styleUrls: ['./card-title.component.scss']
})
export class CardTitleComponent implements OnInit {

  @Input() cardTitle: string;
  @Input() cardTitleClassList: string;
  @Input() cardSubtitle: string;
  @Input() cardSubtitleClassList: string;
  
  constructor() { 
    this.cardTitle="";
    this.cardTitleClassList="section-title";
    this.cardSubtitle="";
    this.cardSubtitleClassList="subtitle-rmf";
  }

  ngOnInit() {
  }

}
