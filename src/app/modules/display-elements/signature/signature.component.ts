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

  @Input('userId') 
  get userId(): string{
    return this.signature.userId;
  }
  set userId(userId: string){
    if(userId){
      this.userSigSvc.findByUserId(this.authSvc.userState.userId).subscribe(
        (sig: UserSignature) => {
          this.signature = sig;
        }
      );
    }
  }

  @Output() onSign: EventEmitter<UserSignature>;

  signature: UserSignature;

  constructor(private userSigSvc: UserSignatureService, private authSvc: AuthService, private dialog: MatDialog) { 
    this.signature = null;
    this.onSign = new EventEmitter<UserSignature>();
  }

  ngOnInit() { }

  sign(): void{
    console.log('sign');
    this.userSigSvc.findByUserId(this.authSvc.userState.userId).subscribe(
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

}
