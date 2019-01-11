import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppMapperComponent } from './app-mapper.component';

describe('AppMapperComponent', () => {
  let component: AppMapperComponent;
  let fixture: ComponentFixture<AppMapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppMapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppMapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
