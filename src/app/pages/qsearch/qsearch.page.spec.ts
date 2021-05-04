import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QsearchPage } from './qsearch.page';

describe('QsearchPage', () => {
  let component: QsearchPage;
  let fixture: ComponentFixture<QsearchPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QsearchPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QsearchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
