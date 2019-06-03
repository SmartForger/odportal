import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild,
  Output,
  EventEmitter
} from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { pairwise, switchMap, takeUntil } from 'rxjs/operators';

interface Point {
  x: number;
  y: number;
}

@Component({
  selector: 'app-sign',
  templateUrl: './sign.component.html',
  styleUrls: ['./sign.component.scss']
})
export class SignComponent implements AfterViewInit, OnDestroy {
  @Input() width = 512;
  @Input() height = 256;
  @Output() save = new EventEmitter();
  @ViewChild('canvas') canvas: ElementRef;
  cx: CanvasRenderingContext2D;
  drawingSubscription: Subscription;
  pListArray: Array<Point[]> = [];
  pCurrentList: Point[] = [];
  currentPos = 0;

  constructor() {}

  ngAfterViewInit() {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.cx = canvasEl.getContext('2d');

    canvasEl.width = this.width;
    canvasEl.height = this.height;

    this.cx.lineWidth = 3;
    this.cx.lineCap = 'round';
    this.cx.strokeStyle = '#000';

    this.captureEvents(canvasEl);
  }

  ngOnDestroy() {
    this.drawingSubscription.unsubscribe();
  }

  captureEvents(canvasEl: HTMLCanvasElement) {
    this.drawingSubscription = fromEvent(canvasEl, 'mousedown')
      .pipe(
        switchMap((e: MouseEvent) => {
          const rect = canvasEl.getBoundingClientRect();

          if (this.currentPos < this.pListArray.length) {
            this.pListArray = this.pListArray.filter(
              (plist, i) => i < this.currentPos
            );
          }
          if (this.pCurrentList.length > 0) {
            this.pListArray[this.currentPos++] = this.pCurrentList;
          }

          this.pCurrentList = [];

          return fromEvent(canvasEl, 'mousemove').pipe(
            takeUntil(fromEvent(canvasEl, 'mouseup')),
            takeUntil(fromEvent(canvasEl, 'mouseleave')),
            pairwise()
          );
        })
      )
      .subscribe((res: [MouseEvent, MouseEvent]) => {
        const rect = canvasEl.getBoundingClientRect();

        const prevPos = {
          x: res[0].clientX - rect.left,
          y: res[0].clientY - rect.top
        };

        const currentPos = {
          x: res[1].clientX - rect.left,
          y: res[1].clientY - rect.top
        };

        this.pCurrentList.push(currentPos);

        this.drawOnCanvas(prevPos, currentPos);
      });
  }

  drawOnCanvas(prevPos: Point, currentPos: Point) {
    if (!this.cx) {
      return;
    }

    this.cx.beginPath();

    if (prevPos) {
      this.cx.moveTo(prevPos.x, prevPos.y);
      this.cx.lineTo(currentPos.x, currentPos.y);

      this.cx.stroke();
    }
  }

  undo() {
    this.clear();

    if (this.pCurrentList.length > 0) {
      this.pListArray[this.currentPos++] = this.pCurrentList;
      this.pCurrentList = [];
    }

    this.currentPos--;
    this.redrawList();
  }

  redo() {
    if (this.currentPos >= this.pListArray.length) {
      return;
    }

    this.clear();
    this.currentPos++;
    this.redrawList();
  }

  clear(clearListArray?: Boolean) {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    const rect = canvasEl.getBoundingClientRect();
    this.cx.clearRect(0, 0, rect.width, rect.height);

    if (clearListArray) {
      this.currentPos = 0;
      this.pCurrentList = [];
      this.pListArray = [];
    }
  }

  handleSave() {
    this.redrawList();
    
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.save.emit(canvasEl.toDataURL());
  }

  private redrawList() {
    this.pListArray.forEach((plist: Point[], i: number) => {
      if (i >= this.currentPos) {
        return;
      }

      this.cx.beginPath();
      plist.forEach((p: Point, i: number) => {
        if (i === 0) {
          this.cx.moveTo(p.x, p.y);
        } else {
          this.cx.lineTo(p.x, p.y);
        }
      });
      this.cx.stroke();
    });
  }
}
