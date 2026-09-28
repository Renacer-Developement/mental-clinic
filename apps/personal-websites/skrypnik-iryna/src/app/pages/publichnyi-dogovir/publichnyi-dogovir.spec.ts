import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublichnyiDogovir } from './publichnyi-dogovir';

describe('PublichnyiDogovir', () => {
  let component: PublichnyiDogovir;
  let fixture: ComponentFixture<PublichnyiDogovir>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublichnyiDogovir]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublichnyiDogovir);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
