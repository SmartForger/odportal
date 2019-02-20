import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MicroAppRendererComponent } from './micro-app-renderer.component';

describe('MicroAppRendererComponent', () => {
  let component: MicroAppRendererComponent;
  let fixture: ComponentFixture<MicroAppRendererComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MicroAppRendererComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MicroAppRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
