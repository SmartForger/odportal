import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-static-text-field',
  templateUrl: './static-text-field.component.html',
  styleUrls: ['./static-text-field.component.scss']
})
export class StaticTextFieldComponent implements OnInit {
  @Input() label: String = "";
  @Input() value: String = "";

  constructor() { }

  ngOnInit() {
  }

}
