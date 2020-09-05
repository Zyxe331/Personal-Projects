import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionPage } from './section.page';

describe('SectionPage', () => {
  let component: SectionPage;
  let fixture: ComponentFixture<SectionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SectionPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
