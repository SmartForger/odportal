import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-slider-item',
  templateUrl: './slider-item.component.html',
  styleUrls: ['./slider-item.component.scss']
})
export class SliderItemComponent implements OnInit {
  @Input() cols = 0;

  constructor() { }

  ngOnInit() {
  }

  get gridCols() {
    return `repeat(${this.cols}, 1fr)`;
  }

}
