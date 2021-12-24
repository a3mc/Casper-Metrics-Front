import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeightsFullComponent } from './weights-full.component';

describe('WeightsFullComponent', () => {
  let component: WeightsFullComponent;
  let fixture: ComponentFixture<WeightsFullComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeightsFullComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeightsFullComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
