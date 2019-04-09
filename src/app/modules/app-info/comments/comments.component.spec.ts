import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {By} from '@angular/platform-browser';

import { CommentsComponent } from './comments.component';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {AppPermissionsBroker} from '../../../util/app-permissions-broker';
import {MatInputModule} from '@angular/material/input';
import {AppsService} from '../../../services/apps.service';
import {AuthService} from '../../../services/auth.service';
import {AppComment} from '../../../models/app-comment.model';
import { Observable } from 'rxjs';

describe('CommentsComponent', () => {
  let component: CommentsComponent;
  let fixture: ComponentFixture<CommentsComponent>;
  let appsSvc: AppsService;
  let authSvc: AuthService;

  const fakeVendorId: string = "fake-vendor-id";
  const fakeAppId: string = "fake-app-id";
  const fakeMessage = "Message from vendor";

  const vendorComment: AppComment = {
    docId: "fake-comment-two",
    senderFirstName: "Vendor",
    senderLastName: "User",
    senderId: "fake-vendor-id",
    message: fakeMessage,
    isFromVendor: true
  };

  let fakeComments: Array<AppComment> = new Array<AppComment>(
    {
      docId: "fake-comment-one",
      senderFirstName: "Admin",
      senderLastName: "User",
      senderId: "fake-admin-id",
      message: "Message from admin",
      isFromVendor: false
    }
  );

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        CommentsComponent 
      ],
      imports: [
        MatIconModule,
        MatFormFieldModule,
        FormsModule,
        HttpClientTestingModule,
        MatInputModule,
        BrowserAnimationsModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    //Override to avoid interfacing with AuthService
    AppPermissionsBroker.prototype.hasPermission = (roleName: string) => {return true;}
    fixture = TestBed.createComponent(CommentsComponent);
    component = fixture.componentInstance;
    appsSvc = fixture.debugElement.injector.get(AppsService);
    authSvc = fixture.debugElement.injector.get(AuthService);
    component.vendorId = fakeVendorId;
    component.appId = fakeAppId;
    component.isVendor = true;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should list comments and subscribe to user session updates', async(() => {
    let commentsSpy = spyOn(appsSvc, 'fetchVendorAppComments').and.returnValue(new Observable(observer => {
      observer.next(fakeComments);
      observer.complete();
    }));
    let sessionSpy = spyOn(authSvc, 'observeUserSessionUpdates').and.callThrough();
    component.ngOnInit();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(commentsSpy).toHaveBeenCalledTimes(1);
      expect(commentsSpy).toHaveBeenCalledWith(fakeVendorId, fakeAppId);
      expect(sessionSpy).toHaveBeenCalledTimes(1);
      expect(component.comments.length).toBe(1);
      let commentDivs = fixture.debugElement.queryAll(By.css('mb-3'));
      expect(commentDivs.length).toBe(component.comments.length);
    });
  }));

  it('should only display the send controls if the user can create', () => {
    component.canCreate = false;
    fixture.detectChanges();
    let sendControls = fixture.debugElement.query(By.css('.mt-2'));
    expect(sendControls).toBeNull();
    component.canCreate = true;
    fixture.detectChanges();
    sendControls = fixture.debugElement.query(By.css('.mt-2'));
    expect(sendControls).toBeTruthy();
  });

  it('should post a comment and display the new comment', async(() => {
    component.comments = fakeComments;
    expect(component.comments.length).toBe(1);
    let postSpy = spyOn(appsSvc, 'postComment').and.returnValue(new Observable(observer => {
      observer.next(vendorComment);
      observer.complete();
    }));
    component.message = fakeMessage;
    component.canCreate = true;
    fixture.detectChanges();
    let sendBtn = fixture.debugElement.query(By.css('button'));
    sendBtn.triggerEventHandler('click', null);
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.comments.length).toBe(1);
      expect(postSpy).toHaveBeenCalledTimes(1);
      expect(postSpy).toHaveBeenCalledWith({isFromVendor: true, message: fakeMessage});
      let commentDivs = fixture.debugElement.queryAll(By.css('mb-3'));
      expect(commentDivs.length).toBe(component.comments.length);
    });
  }));

  it('should adjust comment classes to reflect whether or not the comment is from the vendor', () => {
    component.comments = fakeComments;
    expect(component.comments.length).toBe(2);
    fixture.detectChanges();
    let commentDivs = fixture.debugElement.queryAll(By.css('.mb-2'));
    expect(commentDivs.length).toBe(component.comments.length);
    expect(commentDivs[0].nativeElement.classList.contains('otherMessage')).toBe(false);
    expect(commentDivs[0].nativeElement.classList.contains('myMessage')).toBe(true);
    expect(commentDivs[1].nativeElement.classList.contains('myMessage')).toBe(false);
    expect(commentDivs[1].nativeElement.classList.contains('otherMessage')).toBe(true);
  });
});
