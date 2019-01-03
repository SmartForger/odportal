import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BindSelectInputComponent } from './bind-select-input.component';

describe('BindSelectInputComponent', () => {
  let component: BindSelectInputComponent;
  let fixture: ComponentFixture<BindSelectInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BindSelectInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BindSelectInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
