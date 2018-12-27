import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StringWithDropdownFilterComponent } from './string-with-dropdown-filter.component';

describe('StringWithDropdownFilterComponent', () => {
  let component: StringWithDropdownFilterComponent;
  let fixture: ComponentFixture<StringWithDropdownFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StringWithDropdownFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StringWithDropdownFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
