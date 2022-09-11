import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelegatorsRewardsComponent } from './delegators-rewards.component';

describe('DelegatorsRewardsComponent', () => {
  let component: DelegatorsRewardsComponent;
  let fixture: ComponentFixture<DelegatorsRewardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DelegatorsRewardsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DelegatorsRewardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
