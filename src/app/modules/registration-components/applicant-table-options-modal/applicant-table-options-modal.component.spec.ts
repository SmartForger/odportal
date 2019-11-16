import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantTableOptionsModalComponent } from './applicant-table-options-modal.component';

describe('ApplicantTableOptionsModalComponent', () => {
  let component: ApplicantTableOptionsModalComponent;
  let fixture: ComponentFixture<ApplicantTableOptionsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicantTableOptionsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicantTableOptionsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
