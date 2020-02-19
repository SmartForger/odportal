import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgChipsAutocompleteComponent } from './ng-chips-autocomplete.component';

describe('NgChipsAutocompleteComponent', () => {
  let component: NgChipsAutocompleteComponent;
  let fixture: ComponentFixture<NgChipsAutocompleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgChipsAutocompleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgChipsAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
