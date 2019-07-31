import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedRequestCardComponent } from './shared-request-card.component';

describe('SharedRequestsCardComponent', () => {
  let component: SharedRequestCardComponent;
  let fixture: ComponentFixture<SharedRequestCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedRequestCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedRequestCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
