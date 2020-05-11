import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CastingItemComponent } from './casting-item.component';

describe('CastingItemComponent', () => {
  let component: CastingItemComponent;
  let fixture: ComponentFixture<CastingItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CastingItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CastingItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
