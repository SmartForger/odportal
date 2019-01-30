import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AltFinalizeComponent } from './alt-finalize.component';

describe('AltFinalizeComponent', () => {
  let component: AltFinalizeComponent;
  let fixture: ComponentFixture<AltFinalizeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AltFinalizeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AltFinalizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
