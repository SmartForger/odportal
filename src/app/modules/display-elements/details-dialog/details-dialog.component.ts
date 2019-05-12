import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";

interface DialogData {
  details: Object,
  title: string
}

@Component({
  selector: 'app-details-dialog',
  templateUrl: './details-dialog.component.html',
  styleUrls: ['./details-dialog.component.scss']
})
export class DetailsDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dialogRef: MatDialogRef<DetailsDialogComponent>
  ) {}

  ngOnInit() {}

  close() {
    this.dialogRef.close();
  }

  keys() {
    return Object.keys(this.data.details);
  }
}
