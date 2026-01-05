import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { encargadoAdminGuard } from './encargado-admin.guard';

describe('encargadoAdminGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => encargadoAdminGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
