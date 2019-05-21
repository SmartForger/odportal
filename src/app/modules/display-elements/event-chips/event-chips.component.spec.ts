import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventChipsComponent } from './event-chips.component';

describe('EventChipsComponent', () => {
  let component: EventChipsComponent;
  let fixture: ComponentFixture<EventChipsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventChipsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventChipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
