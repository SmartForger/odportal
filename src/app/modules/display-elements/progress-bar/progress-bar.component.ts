import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent implements OnInit, OnChanges {
  @Input() progress: number;

  constructor() {
    this.progress = 0;
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.progress) {
      this.progress = parseInt(changes.progress.currentValue);
    }
  }

  get style() {
    return {
      width: this.progress + '%'
    };
  }

}
