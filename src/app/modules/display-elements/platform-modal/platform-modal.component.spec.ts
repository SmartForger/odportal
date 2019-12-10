import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlatformModalComponent } from './platform-modal.component';

describe('PlatformModalComponent', () => {
  let component: PlatformModalComponent;
  let fixture: ComponentFixture<PlatformModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlatformModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlatformModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
