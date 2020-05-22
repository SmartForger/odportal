import {
  Component,
  OnInit,
  Input,
  ElementRef,
  ViewChild,
  EventEmitter,
  Output
} from '@angular/core';

@Component({
  selector: 'app-grid-slider',
  templateUrl: './grid-slider.component.html',
  styleUrls: ['./grid-slider.component.scss']
})
export class GridSliderComponent implements OnInit {
  @Input() page: number = 0;
  @Output() pageChange: EventEmitter<any>;
  @ViewChild('root') rootEl: ElementRef<HTMLElement>;

  pages: number[] = [];
  currentPage = 0;
  width = 0;

  constructor() {
    this.pageChange = new EventEmitter();
  }

  ngOnInit() {
    for (let i = 0; i < this.page; i++) {
      this.pages.push(i);
    }
  }

  ngAfterViewInit() {
    this.width = this.rootEl.nativeElement.clientWidth;
  }

  changePage(page: number) {
    if (this.currentPage !== page) {
      this.currentPage = page;
      this.emitPageChange(page);
    }
  }

  prevPage() {
    if (this.currentPage > 0) {
      this.currentPage --;
      this.pageChange.emit(this.currentPage);
      this.emitPageChange(this.currentPage);
    }
  }

  nextPage() {
    if (this.currentPage < this.page - 1) {
      this.currentPage ++;
      this.emitPageChange(this.currentPage);
    }
  }

  get contentStyle() {
    return this.width ? {
      marginLeft: `${-this.width * this.currentPage}px`,
      width: `${this.width * this.page}px`
    } : {};
  }

  private emitPageChange(page: number) {
    setTimeout(() => {
      this.pageChange.emit(page);
    }, 500);
  }
}
