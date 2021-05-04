import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidQuestionnairePage } from './valid-questionnaire.page';

describe('ValidQuestionnairePage', () => {
  let component: ValidQuestionnairePage;
  let fixture: ComponentFixture<ValidQuestionnairePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidQuestionnairePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidQuestionnairePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
