import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PlatformModalType } from 'src/app/models/platform-modal.model';

@Component({
  selector: 'app-faq-modal',
  templateUrl: './faq-modal.component.html',
  styleUrls: ['./faq-modal.component.scss']
})
export class FaqModalComponent implements OnInit {
  question: string = '';
  answer: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dlgRef: MatDialogRef<FaqModalComponent>
  ) {
    this.dlgRef.addPanelClass("platform-modal");
    this.dlgRef.addPanelClass(PlatformModalType.PRIMARY);

    this.question = data.faq.question;
    this.answer = data.faq.answer;
  }

  ngOnInit() {
  }

  submit() {
    this.dlgRef.close({
      ...this.data.faq,
      question: this.question,
      answer: this.answer
    });
  }

}
