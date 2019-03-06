import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DragDropFilePickerComponent } from './drag-drop-file-picker.component';

describe('DragDropFilePickerComponent', () => {
  let component: DragDropFilePickerComponent;
  let fixture: ComponentFixture<DragDropFilePickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DragDropFilePickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DragDropFilePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
