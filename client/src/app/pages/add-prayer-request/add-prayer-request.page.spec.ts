import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPrayerRequestPage } from './add-prayer-request.page';

describe('AddPrayerRequestPage', () => {
  let component: AddPrayerRequestPage;
  let fixture: ComponentFixture<AddPrayerRequestPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPrayerRequestPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPrayerRequestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
