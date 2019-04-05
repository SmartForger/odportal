import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {By} from '@angular/platform-browser';

import { CreateAppFormComponent } from './create-app-form.component';
import {FilePickersModule} from '../../file-pickers/file-pickers.module';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatProgressBar} from '@angular/material/progress-bar';

describe('CreateAppFormComponent', () => {
  let component: CreateAppFormComponent;
  let fixture: ComponentFixture<CreateAppFormComponent>;
  

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        CreateAppFormComponent 
      ],
      imports: [
        FilePickersModule,
        MatProgressBarModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAppFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should receive the selected file and display file information', async(() => {
    let spy = spyOn(component, 'filePicked').and.callThrough();
    let file: File = new File([], "fake.zip");
    component.filePicker.fileChosen.emit(file);
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledWith(file);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(component.activeFile).toBe(file);
      let fileNameEl = fixture.debugElement.query(By.css('.test-active-file'));
      expect(fileNameEl.nativeElement.innerText).toBe("fake.zip");
    });
  }));

  it('should display an error message only if errorMessage is set', () => {
    expect(component.errorMessage).toBeUndefined();
    let errorMsgEl = fixture.debugElement.query(By.css('.alert-danger'));
    expect(errorMsgEl).toBeNull();
    component.errorMessage = "Error message";
    fixture.detectChanges();
    errorMsgEl = fixture.debugElement.query(By.css('.alert-danger'));
    expect(errorMsgEl).toBeTruthy();
    let errorMsgDisplayEl = errorMsgEl.query(By.css('.test-error-message'));
    expect(errorMsgDisplayEl.nativeElement.innerText).toBe("Error message");
  });

  it('should update the progress bar when uploadProgress is changed', () => {
    let progressBarEl = fixture.debugElement.query(By.directive(MatProgressBar));
    expect(progressBarEl.componentInstance.value).toBe(0);
    component.uploadProgress = 50;
    fixture.detectChanges();
    expect(progressBarEl.componentInstance.value).toBe(50);
  });

  it('should emit the selected file when the Upload button is clicked and activeFile is set', () => {
    let uploadButtonEl = fixture.debugElement.query(By.css('.test-upload-button'));
    let confirmFileSpy = spyOn(component, 'confirmFile').and.callThrough();
    let fileChosenSpy = spyOn(component.fileChosen, 'emit');
    component.activeFile = new File([], "fake.zip");
    uploadButtonEl.nativeElement.click();
    expect(confirmFileSpy).toHaveBeenCalledTimes(1);
    expect(fileChosenSpy).toHaveBeenCalledTimes(1);
  });

  it('should not emit any files when the Upload button is clicked and activeFile is not set', () => {
    let uploadButtonEl = fixture.debugElement.query(By.css('.test-upload-button'));
    let confirmFileSpy = spyOn(component, 'confirmFile').and.callThrough();
    let fileChosenSpy = spyOn(component.fileChosen, 'emit');
    uploadButtonEl.nativeElement.click();
    expect(confirmFileSpy).toHaveBeenCalledTimes(1);
    expect(fileChosenSpy).toHaveBeenCalledTimes(0);
  });

  it('should clear all file-related data', () => {
    component.activeFile = new File([], "fake.zip");
    component.uploadProgress = 50;
    component.errorMessage = "Error message";
    let filePickerSpy = spyOn(component.filePicker, 'clear');
    component.clear();
    expect(component.activeFile).toBeNull();
    expect(component.uploadProgress).toBe(0);
    expect(component.errorMessage).toBeNull();
    expect(filePickerSpy).toHaveBeenCalledTimes(1);
  });
});
