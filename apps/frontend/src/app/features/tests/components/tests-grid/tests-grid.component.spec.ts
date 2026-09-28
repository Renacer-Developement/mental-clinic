import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestsGridComponent } from './tests-grid.component';

describe('TestsGridComponent', () => {
  let component: TestsGridComponent;
  let fixture: ComponentFixture<TestsGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestsGridComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestsGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
