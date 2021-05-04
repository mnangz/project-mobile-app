import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QSurveyPage } from './q-survey.page';

describe('QSurveyPage', () => {
  let component: QSurveyPage;
  let fixture: ComponentFixture<QSurveyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QSurveyPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QSurveyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
