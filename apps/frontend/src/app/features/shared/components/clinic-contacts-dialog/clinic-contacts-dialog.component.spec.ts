import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicContactsDialogComponent } from './clinic-contacts-dialog.component';

describe('ClinicContactsDialogComponent', () => {
  let component: ClinicContactsDialogComponent;
  let fixture: ComponentFixture<ClinicContactsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClinicContactsDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClinicContactsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
