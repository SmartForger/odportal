import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoConfirmComponent } from './video-confirm.component';

describe('VideoConfirmComponent', () => {
  let component: VideoConfirmComponent;
  let fixture: ComponentFixture<VideoConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoConfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
