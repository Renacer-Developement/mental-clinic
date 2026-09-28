import {TestBed} from '@angular/core/testing';

import {ClinicContactsService} from './clinic-contacts-dialog/clinic-contacts.service';

describe('ClinicContactsService', () => {
  let service: ClinicContactsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClinicContactsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
