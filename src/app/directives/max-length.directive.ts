import { Directive, HostListener, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appMaxLength]'
})
export class MaxLengthDirective {

  @Input() maxCharCount: number;

  constructor(private el: ElementRef) { 
    this.maxCharCount = 10;
  }

  @HostListener('keypress') onKeyPress(){
    return this.el.nativeElement.value.length < this.maxCharCount;
  }

  @HostListener('paste', ['$event']) parsePaste(event: KeyboardEvent){
    setTimeout(() => {
      if(this.el.nativeElement.value.length > this.maxCharCount){
        this.el.nativeElement.value = this.el.nativeElement.value.substr(0, this.maxCharCount);
      }
    }, 100);
  }
}
