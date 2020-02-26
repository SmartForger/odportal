import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproverContactsComponent } from './approver-contacts.component';

describe('ApproverContactsComponent', () => {
  let component: ApproverContactsComponent;
  let fixture: ComponentFixture<ApproverContactsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApproverContactsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproverContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
