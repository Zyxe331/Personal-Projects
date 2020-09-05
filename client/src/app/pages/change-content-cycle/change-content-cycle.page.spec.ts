import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeContentCyclePage } from './change-content-cycle.page';

describe('ChangeContentCyclePage', () => {
  let component: ChangeContentCyclePage;
  let fixture: ComponentFixture<ChangeContentCyclePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeContentCyclePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeContentCyclePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
