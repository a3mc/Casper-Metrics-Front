import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CirculatingComponent } from './circulating.component';

describe('CirculatingComponent', () => {
  let component: CirculatingComponent;
  let fixture: ComponentFixture<CirculatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CirculatingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CirculatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
