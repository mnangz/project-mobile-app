import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignInBookingPage } from './sign-in-booking.page';

describe('SignInBookingPage', () => {
  let component: SignInBookingPage;
  let fixture: ComponentFixture<SignInBookingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignInBookingPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignInBookingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
