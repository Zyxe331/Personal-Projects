import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrayerRequestPage } from './prayer-request.page';

describe('PrayerRequestPage', () => {
  let component: PrayerRequestPage;
  let fixture: ComponentFixture<PrayerRequestPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrayerRequestPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrayerRequestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
