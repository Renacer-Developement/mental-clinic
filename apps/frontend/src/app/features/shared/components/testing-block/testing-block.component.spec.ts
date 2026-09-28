import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestingBlockComponent } from './testing-block.component';

describe('TestingBlockComponent', () => {
  let component: TestingBlockComponent;
  let fixture: ComponentFixture<TestingBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestingBlockComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestingBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
