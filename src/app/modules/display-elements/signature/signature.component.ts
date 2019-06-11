import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserSignatureService } from 'src/app/services/user-signature.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserSignature } from 'src/app/models/user-signature.model';
import { MatDialog, MatDialogRef } from '@angular/material/dialog'; 
import { SignComponent } from '../sign/sign.component';

@Component({
  selector: 'app-signature',
  templateUrl: './signature.component.html',
  styleUrls: ['./signature.component.scss']
})
export class SignatureComponent implements OnInit {

  @Input() label: string;
  @Input() signed: boolean;
  @Input() userId: string;
  @Input() readonly: boolean;
  @Output() onSign: EventEmitter<UserSignature>;

  signature: UserSignature;

  constructor(private userSigSvc: UserSignatureService, private authSvc: AuthService, private dialog: MatDialog) { 
    this.signature = null;
    this.onSign = new EventEmitter<UserSignature>();
  }

  ngOnInit() { 
    this.displaySignature();
  }

  sign(): void{
    this.userSigSvc.findByUserId(this.userId).subscribe(
      (sig: UserSignature) => {
        this.signature = sig;
        this.onSign.emit(this.signature);
      },
      (err: any) => {
        let mdr: MatDialogRef<SignComponent> = this.dialog.open(SignComponent);
        mdr.componentInstance.save.subscribe((userSigData: string) => {
          let userSig: UserSignature = {
            userId: this.authSvc.getUserId(),
            createdAt: (new Date()).toUTCString(),
            signatureData: userSigData
          }
          this.userSigSvc.update(userSig).subscribe((sig) => {
            this.signature = sig;
            this.onSign.emit(this.signature);
          });
          mdr.close();
        });
      }
    );
  }

  private displaySignature(): void{
    console.log(`signed ? ${(this.signed ? 'yes' : 'no')}`);
    console.log(`userId ? ${(this.userId ? 'yes' : 'no')}`);
    if(this.signed && this.userId){
      this.userSigSvc.findByUserId(this.userId).subscribe(
        (sig: UserSignature) => {
          console.log('found sig in display signature');
          this.signature = sig;
        }
      );
    }
  }

}
