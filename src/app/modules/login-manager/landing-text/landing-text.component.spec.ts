import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingTextComponent } from './landing-text.component';

describe('LandingTextComponent', () => {
  let component: LandingTextComponent;
  let fixture: ComponentFixture<LandingTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandingTextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
