import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgMicroappsComponent } from './ng-microapps.component';

describe('NgMicroappsComponent', () => {
  let component: NgMicroappsComponent;
  let fixture: ComponentFixture<NgMicroappsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgMicroappsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgMicroappsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
