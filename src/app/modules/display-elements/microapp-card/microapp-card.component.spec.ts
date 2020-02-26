import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MicroappCardComponent } from './microapp-card.component';

describe('MicroappCardComponent', () => {
  let component: MicroappCardComponent;
  let fixture: ComponentFixture<MicroappCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MicroappCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MicroappCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
