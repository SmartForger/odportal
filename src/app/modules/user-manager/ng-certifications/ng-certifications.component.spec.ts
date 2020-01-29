import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgCertificationsComponent } from './ng-certifications.component';

describe('NgCertificationsComponent', () => {
  let component: NgCertificationsComponent;
  let fixture: ComponentFixture<NgCertificationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgCertificationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgCertificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
