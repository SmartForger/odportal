import { Directive, HostListener, Input, ElementRef } from '@angular/core';

@Directive({
  selector: '[appSpecialCharacterWhitelist]'
})
export class SpecialCharacterWhitelistDirective {

  @Input() scWhitelist: string;

  constructor(private el: ElementRef) {
    this.scWhitelist = '';
  }

  @HostListener('keypress', ['$event']) onKeyPress(event: KeyboardEvent){
    return this.isAllowed(event.key);
  }

  @HostListener('paste', ['$event']) parsePaste(event: KeyboardEvent){
    setTimeout(() => {
      let temp: string = this.el.nativeElement.value;
      for(let char of temp){
        if(!this.isAllowed(char)){
          temp = temp.replace(char, '');
        }
      }
      this.el.nativeElement.value = temp;
    }, 100);
  }

  private isAllowed(key: string): boolean{
    if(key.match('[A-Za-z0-9\s]')){
      return true;
    }
    else{
      return this.scWhitelist.includes(key);
    } 
  }
}
