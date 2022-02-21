import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EraProgressComponent } from './era-progress.component';

describe('EraProgressComponent', () => {
  let component: EraProgressComponent;
  let fixture: ComponentFixture<EraProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EraProgressComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EraProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
