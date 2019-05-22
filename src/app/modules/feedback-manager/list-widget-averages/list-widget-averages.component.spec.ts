import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListWidgetAveragesComponent } from './list-widget-averages.component';

describe('ListWidgetAveragesComponent', () => {
  let component: ListWidgetAveragesComponent;
  let fixture: ComponentFixture<ListWidgetAveragesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListWidgetAveragesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListWidgetAveragesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
