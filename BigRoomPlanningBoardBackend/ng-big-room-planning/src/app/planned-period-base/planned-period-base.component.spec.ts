import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlannedPeriodBaseComponent } from './planned-period-base.component';

describe('PlannedPeriodBaseComponent', () => {
  let component: PlannedPeriodBaseComponent;
  let fixture: ComponentFixture<PlannedPeriodBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlannedPeriodBaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlannedPeriodBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
