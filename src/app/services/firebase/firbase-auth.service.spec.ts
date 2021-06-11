import { TestBed } from '@angular/core/testing';

import { FirbaseAuthService } from './firbase-auth.service';

describe('FirbaseAuthService', () => {
  let service: FirbaseAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirbaseAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
