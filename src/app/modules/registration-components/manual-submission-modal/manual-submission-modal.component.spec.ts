import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualSubmissionModalComponent } from './manual-submission-modal.component';

describe('ManualSubmissionModalComponent', () => {
  let component: ManualSubmissionModalComponent;
  let fixture: ComponentFixture<ManualSubmissionModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManualSubmissionModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualSubmissionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
