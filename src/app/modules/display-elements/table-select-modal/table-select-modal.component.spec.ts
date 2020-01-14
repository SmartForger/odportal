import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableSelectModalComponent } from './table-select-modal.component';

describe('TableSelectModalComponent', () => {
  let component: TableSelectModalComponent;
  let fixture: ComponentFixture<TableSelectModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableSelectModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableSelectModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
