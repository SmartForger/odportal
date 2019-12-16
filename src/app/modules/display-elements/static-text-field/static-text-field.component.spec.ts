import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StaticTextFieldComponent } from './static-text-field.component';

describe('StaticTextFieldComponent', () => {
  let component: StaticTextFieldComponent;
  let fixture: ComponentFixture<StaticTextFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StaticTextFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StaticTextFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
