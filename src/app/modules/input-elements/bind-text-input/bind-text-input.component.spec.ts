import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BindTextInputComponent } from './bind-text-input.component';

describe('BindTextInputComponent', () => {
  let component: BindTextInputComponent;
  let fixture: ComponentFixture<BindTextInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BindTextInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BindTextInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
