import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-grid-slider',
  templateUrl: './grid-slider.component.html',
  styleUrls: ['./grid-slider.component.scss']
})
export class GridSliderComponent implements OnInit {
  @Input() page: number = 0;
  @ViewChild('root') rootEl: ElementRef<HTMLElement>;

  pages: number[] = [];
  currentPage = 0;
  width = 0;

  constructor() { }

  ngOnInit() {
    for (let i = 0; i < this.page; i++) {
      this.pages.push(i);
    }
  }

  ngAfterViewInit() {
    this.width = this.rootEl.nativeElement.clientWidth;
  }

  changePage(page: number) {
    this.currentPage = page;
  }

  prevPage() {
    this.currentPage = this.currentPage > 0 ? this.currentPage - 1 : 0;
  }

  nextPage() {
    this.currentPage = this.currentPage < this.page - 1 ? this.currentPage + 1 : this.page - 1;
  }

  get contentStyle() {
    return this.width ? {
      marginLeft: `${-this.width * this.currentPage}px`,
      width: `${this.width * this.page}px`
    } : {};
  }
}
