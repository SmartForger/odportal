import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-rename-modal',
  templateUrl: './rename-modal.component.html',
  styleUrls: ['./rename-modal.component.scss']
})
export class RenameModalComponent implements OnInit {
    formGroup: FormGroup;
    title: string;
  
    @Output() saveTitle: EventEmitter<string>;
  
    constructor(private fb: FormBuilder) { 
      this.title = '';
      this.saveTitle = new EventEmitter<string>();
    }
  
    ngOnInit() {
      this.formGroup = this.fb.group({
        title: this.title
      });
      this.formGroup.get('title').setValidators([Validators.required, Validators.maxLength(256)]);
    }

    nameChanged(name: string): void{
      this.title = name;
    }

    onKeydown(event: KeyboardEvent): void{
        if(this.formGroup.valid && event.key === 'Enter'){
            this.saveTitle.emit(this.title);
        }
    }
}
