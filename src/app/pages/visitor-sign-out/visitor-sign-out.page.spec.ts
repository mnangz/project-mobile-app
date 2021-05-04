import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitorSignOutPage } from './visitor-sign-out.page';

describe('VisitorSignOutPage', () => {
  let component: VisitorSignOutPage;
  let fixture: ComponentFixture<VisitorSignOutPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisitorSignOutPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitorSignOutPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
