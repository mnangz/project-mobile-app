import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualSearchPage } from './manual-search.page';

describe('ManualSearchPage', () => {
  let component: ManualSearchPage;
  let fixture: ComponentFixture<ManualSearchPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManualSearchPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualSearchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
