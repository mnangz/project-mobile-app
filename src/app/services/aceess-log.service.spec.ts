import { TestBed } from '@angular/core/testing';

import { AceessLogService } from './aceess-log.service';

describe('AceessLogService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AceessLogService = TestBed.get(AceessLogService);
    expect(service).toBeTruthy();
  });
});
