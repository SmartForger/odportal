import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgMattermostComponent } from './ng-mattermost.component';

describe('NgMattermostComponent', () => {
  let component: NgMattermostComponent;
  let fixture: ComponentFixture<NgMattermostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgMattermostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgMattermostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
