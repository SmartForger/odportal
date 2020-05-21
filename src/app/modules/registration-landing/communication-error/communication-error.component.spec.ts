import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunicationErrorComponent } from './communication-error.component';

describe('CommunicationErrorComponent', () => {
  let component: CommunicationErrorComponent;
  let fixture: ComponentFixture<CommunicationErrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommunicationErrorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunicationErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
