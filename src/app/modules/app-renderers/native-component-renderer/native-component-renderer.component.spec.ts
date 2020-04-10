import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NativeComponentRendererComponent } from './native-component-renderer.component';

describe('NativeComponentRendererComponent', () => {
  let component: NativeComponentRendererComponent;
  let fixture: ComponentFixture<NativeComponentRendererComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NativeComponentRendererComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NativeComponentRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
