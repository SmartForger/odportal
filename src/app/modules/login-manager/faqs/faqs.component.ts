import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { FaqModalComponent } from '../faq-modal/faq-modal.component';
import { FAQModel } from 'src/app/models/faq.model';
import { FaqService } from 'src/app/services/faq.service';

import * as moment from 'moment';

@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.scss']
})
export class FaqsComponent implements OnInit {
  faqs: FAQModel[] = [];

  constructor(private dialog: MatDialog, private faqService: FaqService) { }

  ngOnInit() {
    this.getFAQs();
  }

  openCreateModal() {
    const modalRef: MatDialogRef<FaqModalComponent> = this.dialog.open(FaqModalComponent, {
      data: {
        faq: {
          question: '',
          answer: ''
        },
        submitLabel: 'Publish FAQ',
        title: 'Create FAQ'
      }
    });

    modalRef.afterClosed().subscribe((data: FAQModel) => {
      if (data) {
        this.faqService.createFAQ(data).subscribe((faq: FAQModel) => {
          this.faqs.push(faq);
        });
      }
    });
  }

  openEditModal(faq) {
    const modalRef: MatDialogRef<FaqModalComponent> = this.dialog.open(FaqModalComponent, {
      data: {
        faq,
        submitLabel: 'Update FAQ',
        title: 'Edit FAQ'
      }
    });

    modalRef.afterClosed().subscribe((data: FAQModel) => {
      if (data) {
        this.faqService.updateFAQ(data).subscribe((faq: FAQModel) => {
          this.faqs = this.faqs.map((item: FAQModel) => item.docId === faq.docId ? faq : item);
        });
      }
    });
  }

  getFAQs() {
    this.faqService.getFAQs().subscribe((faqs: FAQModel[]) => {
      this.faqs = faqs;
    });
  }

  deleteFAQ(faq: FAQModel) {
    this.faqService.deleteFAQ(faq.docId).subscribe(() => {
      this.faqs = this.faqs.filter((item: FAQModel) => item.docId !== faq.docId);
    });
  }

  formatTime(dateStr: string) {
    return moment(dateStr).format('MM/DD/YYYY hh:mmA');
  }
}
