import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TelegramBannerComponent } from './telegram-banner.component';

describe('TelegramBannerComponent', () => {
  let component: TelegramBannerComponent;
  let fixture: ComponentFixture<TelegramBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TelegramBannerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TelegramBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
