import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletionProgressComponent } from './completion-progress.component';

describe('CompletionProgressComponent', () => {
  let component: CompletionProgressComponent;
  let fixture: ComponentFixture<CompletionProgressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompletionProgressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompletionProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
