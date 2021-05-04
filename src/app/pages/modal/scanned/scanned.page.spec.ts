import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScannedPage } from './scanned.page';

describe('ScannedPage', () => {
  let component: ScannedPage;
  let fixture: ComponentFixture<ScannedPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScannedPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScannedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
