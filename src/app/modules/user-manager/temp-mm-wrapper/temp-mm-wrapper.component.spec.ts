import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TempMmWrapperComponent } from './temp-mm-wrapper.component';

describe('TempMmWrapperComponent', () => {
  let component: TempMmWrapperComponent;
  let fixture: ComponentFixture<TempMmWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TempMmWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TempMmWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
