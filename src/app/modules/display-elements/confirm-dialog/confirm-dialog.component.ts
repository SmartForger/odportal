import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

export interface ConfirmDialogParams {
  title?: string;
  message?: string;
  icons?: {
    icon: string;
    class?: string;
  }
  buttons?: {
    action: string;
    title: string;
    color: string;
    class?: string;
  }
}

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogParams,
    private dialogRef: MatDialogRef<ConfirmDialogComponent>
  ) { }

  ngOnInit() {
  }

  closeModal(action?: string) {
    this.dialogRef.close(action);
  }
}
