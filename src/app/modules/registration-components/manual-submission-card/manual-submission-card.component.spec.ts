import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualSubmissionCardComponent } from './manual-submission-card.component';

describe('ManualSubmissionCardComponent', () => {
  let component: ManualSubmissionCardComponent;
  let fixture: ComponentFixture<ManualSubmissionCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManualSubmissionCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualSubmissionCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
