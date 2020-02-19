import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAllEnvironmentsComponent } from './list-all-environments.component';

describe('ListAllEnvironmentsComponent', () => {
  let component: ListAllEnvironmentsComponent;
  let fixture: ComponentFixture<ListAllEnvironmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListAllEnvironmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAllEnvironmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
