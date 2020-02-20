import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachmentsCardComponent } from './attachments-card.component';

describe('AttachmentsCardComponent', () => {
  let component: AttachmentsCardComponent;
  let fixture: ComponentFixture<AttachmentsCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttachmentsCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttachmentsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
