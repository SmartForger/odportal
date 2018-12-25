import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicStringFilterComponent } from './basic-string-filter.component';

describe('BasicStringFilterComponent', () => {
  let component: BasicStringFilterComponent;
  let fixture: ComponentFixture<BasicStringFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BasicStringFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicStringFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
