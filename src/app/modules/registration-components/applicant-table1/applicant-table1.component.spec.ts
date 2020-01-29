import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantTable1Component } from './applicant-table1.component';

describe('ApplicantTable1Component', () => {
  let component: ApplicantTable1Component;
  let fixture: ComponentFixture<ApplicantTable1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicantTable1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicantTable1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
