import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListviewToolbarComponent } from './listview-toolbar.component';

describe('ListviewToolbarComponent', () => {
  let component: ListviewToolbarComponent;
  let fixture: ComponentFixture<ListviewToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListviewToolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListviewToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
