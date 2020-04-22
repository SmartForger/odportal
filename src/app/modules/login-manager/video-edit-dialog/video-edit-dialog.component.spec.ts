import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoEditDialogComponent } from './video-edit-dialog.component';

describe('VideoEditDialogComponent', () => {
  let component: VideoEditDialogComponent;
  let fixture: ComponentFixture<VideoEditDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoEditDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
