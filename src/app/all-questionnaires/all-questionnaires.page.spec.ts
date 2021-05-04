import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllQuestionnairesPage } from './all-questionnaires.page';

describe('AllQuestionnairesPage', () => {
  let component: AllQuestionnairesPage;
  let fixture: ComponentFixture<AllQuestionnairesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllQuestionnairesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllQuestionnairesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
