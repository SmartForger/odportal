import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

export interface MessageDialogParams {

    title: string;
    message: string;
    icon?: string;
    iconClass?: string;
    btnText: string;
}

@Component({
  selector: 'app-message-dialog',
  templateUrl: './message-dialog.component.html',
  styleUrls: ['./message-dialog.component.scss']
})
export class MessageDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: MessageDialogParams,
    private dialogRef: MatDialogRef<MessageDialogComponent>
  ) { }

  ngOnInit() {
  }

  close(): void {
    this.dialogRef.close();
  }

}
