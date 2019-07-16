import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appDisallowSpaces]'
})
export class DisallowSpacesDirective{

  constructor(private el: ElementRef) { }

  @HostListener('keypress', ['$event']) onKeyPress(event: KeyboardEvent){
    return event.key !== ' ';
  }

  @HostListener('paste', ['$event']) parsePaste(event: KeyboardEvent){
    setTimeout(() => {
      this.el.nativeElement.value = this.el.nativeElement.value.replace(/[/\s]/g, '');
    }, 100)
  }

}
