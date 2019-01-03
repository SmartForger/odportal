import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BindCheckboxInputComponent } from './bind-checkbox-input.component';

describe('BindCheckboxInputComponent', () => {
  let component: BindCheckboxInputComponent;
  let fixture: ComponentFixture<BindCheckboxInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BindCheckboxInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BindCheckboxInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
