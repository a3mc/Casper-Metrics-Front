import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransfersFullComponent } from './transfers-full.component';

describe('TransfersFullComponent', () => {
  let component: TransfersFullComponent;
  let fixture: ComponentFixture<TransfersFullComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransfersFullComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransfersFullComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
