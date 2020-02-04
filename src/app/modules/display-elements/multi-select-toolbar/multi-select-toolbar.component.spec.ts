import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiSelectToolbarComponent } from './multi-select-toolbar.component';

describe('MultiSelectToolbarComponent', () => {
  let component: MultiSelectToolbarComponent;
  let fixture: ComponentFixture<MultiSelectToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiSelectToolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiSelectToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
