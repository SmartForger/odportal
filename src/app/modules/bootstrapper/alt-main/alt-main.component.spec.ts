import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AltMainComponent } from './alt-main.component';

describe('AltMainComponent', () => {
  let component: AltMainComponent;
  let fixture: ComponentFixture<AltMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AltMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AltMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
