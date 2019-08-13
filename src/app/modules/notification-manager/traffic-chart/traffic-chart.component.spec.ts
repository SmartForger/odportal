import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrafficChartComponent } from './traffic-chart.component';

describe('TrafficChartComponent', () => {
  let component: TrafficChartComponent;
  let fixture: ComponentFixture<TrafficChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrafficChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrafficChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
