import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPageAveragesComponent } from './list-page-averages.component';

describe('ListPageAveragesComponent', () => {
  let component: ListPageAveragesComponent;
  let fixture: ComponentFixture<ListPageAveragesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListPageAveragesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPageAveragesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
