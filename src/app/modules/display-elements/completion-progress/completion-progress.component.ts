import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-completion-progress',
  templateUrl: './completion-progress.component.html',
  styleUrls: ['./completion-progress.component.scss']
})
export class CompletionProgressComponent implements OnInit {
  @Input() percent = 0;

  constructor() {}

  ngOnInit() {}

  getColoredPath() {
    const alpha = (Math.PI * (100 - this.percent)) / 100;
    const p = [
      {
        x: Math.cos(alpha) * 150,
        y: -Math.sin(alpha) * 150
      },
      {
        x: Math.cos(alpha) * 120,
        y: -Math.sin(alpha) * 120
      }
    ];

    return `M-150 0 A 150 150 0 0 1 ${p[0].x} ${p[0].y} L ${p[1].x} ${
      p[1].y
    } A 120 120 0 0 0 -120 0 L-150 0`;
  }
}
