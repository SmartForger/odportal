import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MicroappIconComponent } from './microapp-icon.component';

describe('MicroappIconComponent', () => {
  let component: MicroappIconComponent;
  let fixture: ComponentFixture<MicroappIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MicroappIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MicroappIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
