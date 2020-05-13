import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CastingModalComponent } from './casting-modal.component';

describe('CastingModalComponent', () => {
  let component: CastingModalComponent;
  let fixture: ComponentFixture<CastingModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CastingModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CastingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
