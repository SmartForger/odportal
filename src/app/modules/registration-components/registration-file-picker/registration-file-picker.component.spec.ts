import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationFilePickerComponent } from './registration-file-picker.component';

describe('RegistrationFilePickerComponent', () => {
  let component: RegistrationFilePickerComponent;
  let fixture: ComponentFixture<RegistrationFilePickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrationFilePickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationFilePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
