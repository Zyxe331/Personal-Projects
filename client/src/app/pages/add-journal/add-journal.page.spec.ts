import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddJournalPage } from './add-journal.page';

describe('AddJournalPage', () => {
  let component: AddJournalPage;
  let fixture: ComponentFixture<AddJournalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddJournalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddJournalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
