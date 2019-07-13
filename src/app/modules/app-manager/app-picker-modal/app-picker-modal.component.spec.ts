import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppPickerModalComponent } from './app-picker-modal.component';

describe('AppPickerModalComponent', () => {
  let component: AppPickerModalComponent;
  let fixture: ComponentFixture<AppPickerModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppPickerModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppPickerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
