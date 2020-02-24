import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppearanceGeneralComponent } from './appearance-general.component';

describe('AppearanceGeneralComponent', () => {
  let component: AppearanceGeneralComponent;
  let fixture: ComponentFixture<AppearanceGeneralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppearanceGeneralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppearanceGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
