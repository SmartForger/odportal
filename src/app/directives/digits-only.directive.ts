import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appDigitsOnly]'
})
export class DigitsOnlyDirective {

  digitRegExp: RegExp;

  constructor(private el: ElementRef) { 
    this.digitRegExp = new RegExp('[0-9]');
  }

  @HostListener('keypress', ['$event']) onKeyPress(event: KeyboardEvent){
    return this.digitRegExp.test(event.key);
  }

  @HostListener('paste', ['$event']) parsePaste(event: KeyboardEvent){
    setTimeout(() => {
      this.el.nativeElement.value = this.el.nativeElement.value.replace(/[^0-9]/g, '');
    }, 100);
  }
}
